import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Fonction pour prendre une photo et l'uploader sur Cloudinary
export const pickImageAndUpload = async () => {
  try {
    console.log("📷 Lancement de la caméra...");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log("📷 Résultat de la capture:", result);

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log("⚠️ L'utilisateur a annulé la sélection d'image.");
      return null;
    }

    const uri = result.assets[0].uri;
    console.log("📸 URI de l'image capturée:", uri);

    // Upload dans Cloudinary
    console.log("☁️ Envoi de l'image à Cloudinary...");

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'profile_picture.jpg',
    });
    formData.append('upload_preset', 'mobiles5'); // Assure-toi que ce preset existe sur Cloudinary

    const response = await fetch('https://api.cloudinary.com/v1_1/djalkrrwa/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error("❌ Erreur lors de l'upload de l'image sur Cloudinary.");
    }

    const data = await response.json();
    const imageUrl = data.secure_url;

    console.log("✅ Image URL reçue:", imageUrl);

    // Récupération des informations de session
    const sessionData = await AsyncStorage.getItem('auth_connected');
    if (!sessionData) {
      throw new Error("❌ Aucune session utilisateur trouvée.");
    }

    const { idUser } = JSON.parse(sessionData);

    if (!idUser) {
      throw new Error("❌ ID utilisateur introuvable dans la session.");
    }

    console.log("🔍 ID utilisateur récupéré :", idUser);

    // Mise à jour du champ `img` dans Firestore
    const userDocRef = doc(db, 'Utilisateurs', idUser);
    await setDoc(userDocRef, { img: imageUrl }, { merge: true });

    console.log("✅ URL de l'image sauvegardée dans Firestore.");

    return imageUrl;
  } catch (error) {
    console.error("❌ Erreur lors de l'upload de l'image :", error);
    return null;
  }
};

// Fonction pour récupérer l'URL de la photo de profil depuis Firestore
export const getProfilePictureUrl = async () => {
  try {
    console.log("🔍 Récupération de la photo de profil...");

    // Récupération des informations de session
    const sessionData = await AsyncStorage.getItem('auth_connected');
    if (!sessionData) {
      throw new Error("❌ Aucune session utilisateur trouvée.");
    }

    const { idUser } = JSON.parse(sessionData);

    if (!idUser) {
      throw new Error("❌ ID utilisateur introuvable dans la session.");
    }

    console.log("🔍 ID utilisateur récupéré :", idUser);

    const userDocRef = doc(db, 'Utilisateurs', idUser);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("❌ Document utilisateur introuvable dans Firestore.");
      return null;
    }

    const userData = userDoc.data();
    console.log("📄 Données utilisateur récupérées :", userData);

    return userData.img || null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la photo de profil :", error);
    return null;
  }
};
