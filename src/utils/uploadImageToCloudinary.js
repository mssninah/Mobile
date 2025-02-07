import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../config/firebase-config';
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

    console.log("☁️ Réponse de Cloudinary:", response);

    if (!response.ok) {
      throw new Error("❌ Erreur lors de l'upload de l'image sur Cloudinary.");
    }

    const data = await response.json();
    console.log("☁️ Cloudinary Data:", data);

    const imageUrl = data.secure_url;
    console.log("✅ Image URL reçue:", imageUrl);

    // Sauvegarde l'URL sur Firestore avec l'email de l'utilisateur
    console.log("🔍 Récupération des infos utilisateur...");
    
    const user = auth.currentUser;
    if (!user) throw new Error("❌ Utilisateur non authentifié.");

    const userEmail = user.email;
    console.log("📧 Email utilisateur:", userEmail);

    const userDocRef = doc(db, 'users', userEmail);
    console.log("📂 Référence du document Firestore:", userDocRef.path);

    await setDoc(userDocRef, { profileImage: imageUrl }, { merge: true });

    console.log("✅ URL de l'image sauvegardée dans Firestore.");

    return imageUrl;
  } catch (error) {
    console.error("❌ Erreur lors de l'upload de l'image:", error);
    return null;
  }
};

// Fonction pour récupérer l'URL de la photo de profil depuis Firestore
export const getProfilePictureUrl = async () => {
  try {
    console.log("🔍 Récupération de la photo de profil...");

    const user = auth.currentUser;
    if (!user) throw new Error("❌ Utilisateur non authentifié.");

    const userEmail = user.email;
    console.log("📧 Email utilisateur:", userEmail);

    const userDocRef = doc(db, 'users', userEmail);
    console.log("📂 Référence du document Firestore:", userDocRef.path);

    const userDoc = await getDoc(userDocRef);
    console.log("📄 Données du document Firestore:", userDoc.exists() ? userDoc.data() : "Document non trouvé.");

    if (!userDoc.exists()) return null;

    return userDoc.data().profileImage || null;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la photo de profil:", error);
    return null;
  }
};
