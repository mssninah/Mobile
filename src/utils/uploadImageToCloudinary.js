import { launchCamera } from 'react-native-image-picker';
import { auth, db } from '../config/firebase-config';
import { getDoc, doc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore functions

// Fonction pour prendre une photo et l'upload sur Cloudinary
export const pickImageAndUpload = async () => {
  const options = {
    mediaType: 'photo',
    quality: 1,
  };

  // Capture Image
  const result = await launchCamera(options);

  if (result.didCancel) {
    console.log('User cancelled image picker');
    return null;
  }

  if (result.errorCode) {
    console.log('ImagePicker Error: ', result.errorMessage);
    return null;
  }

  const uri = result.assets[0].uri;

  // Upload dans Cloudinary
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg', // or another type based on the format
      name: 'profile_picture.jpg',
    });
    formData.append('upload_preset', 'mobiles5'); // Ensure you've configured a preset in Cloudinary

    // Perform the upload
    const response = await fetch('https://api.cloudinary.com/v1_1/djalkrrwa/image/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const imageUrl = data.secure_url; // URL of the image after upload

    // Save the URL to Firestore
    const userId = auth.currentUser?.uid; // Replace with the current user's ID
    const userDocRef = doc(db, 'users', userId); // Get document reference
    await updateDoc(userDocRef, {
      profilePictureUrl: imageUrl,
    });

    return imageUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image", error);
    return null;
  }
};


export const getProfilePictureUrl = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }

    const userId = user.uid;
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return null; // Retourne null si l'utilisateur n'existe pas dans Firestore
    }

    const userData = userDoc.data();

    if (!userData.email) {
      return null; // Retourne null si l'email n'est pas encore enregistré
    }

    return {
      profilePictureUrl: userData.profilePictureUrl || null,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'URL de la photo de profil:", error.message);
    return null;
  }
};
