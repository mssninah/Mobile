import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import { registerForPushNotificationsAsync, sendPushNotification } from './pushNotificationService';

export const login = async (email, password) => {
  try {
    // Étape 1: Validation des entrées utilisateur
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw { code: 'auth/empty-fields', message: 'Email ou mot de passe vide.' };
    }

    // Étape 2: Recherche de l'utilisateur dans Firestore
    const usersRef = collection(db, 'Utilisateurs');
    const q = query(usersRef, where('mail', '==', trimmedEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw { code: 'auth/user-not-found', message: 'Aucun utilisateur trouvé avec cet email.' };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Étape 3: Validation du mot de passe
    const isPasswordValid = bcrypt.compareSync(trimmedPassword, userData.password);
    if (!isPasswordValid) {
      throw { code: 'auth/wrong-password', message: 'Mot de passe incorrect.' };
    }

    // Étape 4: Création de la session utilisateur
    const auth_connected = {
      idUser: userDoc.id,
      mail: userData.mail,
      isSynced: userData.isSynced,
      validate: userData.validate,
      lastUpdate: userData.lastUpdate,
      img: userData.img || null, // Ajout d'une valeur par défaut si l'image est absente
    };

    await AsyncStorage.setItem('auth_connected', JSON.stringify(auth_connected));

    // Étape 5: Notifications push
    const expoPushToken = await registerForPushNotificationsAsync();
    if (expoPushToken) {
      await sendPushNotification(expoPushToken, `@${trimmedEmail}, content de vous voir !`);
    }

    return auth_connected;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);

    // Gestion des erreurs explicites
    if (error.code === 'auth/empty-fields') {
      alert('Email et mot de passe ne peuvent pas être vides.');
    } else if (error.code === 'auth/user-not-found') {
      alert('Aucun utilisateur trouvé avec cet email.');
    } else if (error.code === 'auth/wrong-password') {
      alert('Mot de passe incorrect.');
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }

    throw error; // Relancer l'erreur pour un traitement éventuel au niveau supérieur
  }
};

export const logout = async () => {
  try {
    // Supprimer la session utilisateur de AsyncStorage
    await AsyncStorage.removeItem('auth_connected');
    console.log('Utilisateur déconnecté avec succès.');
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
    throw error;
  }
};
