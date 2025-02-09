import { auth, db } from '../config/firebase-config'; // Importez votre configuration Firebase
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Récupère le document utilisateur Firestore correspondant à l'utilisateur actuellement connecté.
 * @returns {Promise<Object|null>} - Le document utilisateur trouvé ou null si aucun n'est trouvé.
 */
const getFirestoreUserDocument = async () => {
  try {
    // Vérifiez si un utilisateur est connecté via Firebase Authentication
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("Aucun utilisateur connecté.");
      return null;
    }

    const email = currentUser.email; // Obtenez l'email de l'utilisateur connecté

    // Requête Firestore pour récupérer le document correspondant
    const usersRef = collection(db, "Utilisateurs");
    const q = query(usersRef, where("mail", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Aucun document utilisateur trouvé dans Firestore.");
      return null;
    }

    // Retour du premier document trouvé
    const userDoc = querySnapshot.docs[0];
    console.log("Document utilisateur trouvé :", userDoc);

    // Structure des données retournées
    return {
      id: userDoc.id,
      idUser: userDoc.data().iduser, // Assurez-vous que le champ est bien `iduser`
      img: userDoc.data().img,
      isSynced: userDoc.data().isSynced,
      lastUpdate: userDoc.data().lastUpdate,
      mail: userDoc.data().mail,
      password: userDoc.data().password,
      tentative: userDoc.data().tentative,
      validate: userDoc.data().validate,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du document utilisateur :", error);
    throw error;
  }
};

export default getFirestoreUserDocument;
