import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase-config';
import { getDocs, collection } from 'firebase/firestore';

export const getUserTransactions = async () => {
  try {
    // Récupérer l'utilisateur connecté depuis AsyncStorage
    const authConnected = await AsyncStorage.getItem('auth_connected');
    if (!authConnected) {
      throw new Error('❌ Aucun utilisateur connecté trouvé.');
    }

    const { idUser } = JSON.parse(authConnected);
    console.log('👤 ID de l\'utilisateur connecté :', idUser);

    // Récupérer toutes les transactions
    const snapshot = await getDocs(collection(db, 'TransactionCryptos'));

    // Filtrer les transactions avec JavaScript

    const transactions = snapshot.docs
        .map((doc) => doc.data()) // Récupère les données
        .filter((data) => data.utilisateur?.iduser.toString() === idUser.toString()) // Filtre par ID utilisateur
        .map((data) => ({
            id: data.idTransactionCrypto,
            crypto: data.cryptomonnaie.description,
            type: data.typeMvt.description,
            quantity: parseFloat(data.qtt).toFixed(2),
            amount: parseFloat(data.montant).toFixed(2),
            date: new Date(data.dateTransaction.seconds * 1000).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            }), // Convertit la date Firestore en chaîne lisible
        }));

    console.log('📄 Transactions de l\'utilisateur :', transactions);
    return transactions;
  } catch (error) {
    console.error('Erreur dans getUserTransactions :', error);
    throw error;
  }
};
