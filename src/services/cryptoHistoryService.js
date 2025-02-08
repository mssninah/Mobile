import { db } from '../config/firebase-config'; // Assurez-vous que Firebase est bien configuré
import { getDocs, collection, query, onSnapshot } from 'firebase/firestore';





// Service to fetch historical courses
export const fetchCryptoHistory = async () => {
  try {
    // Getting data from the 'CoursHistorique' collection
    const querySnapshot = await getDocs(collection(db, 'CoursHistorique'));
    console.log('Données récupérées avec succès, nombre de documents:', querySnapshot.size);

    const historyData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        idCoursHistorique: doc.id, // Document ID
        idCrypto: data.idCrypto,
        montant: data.montant,
        dateCours: data.dateCours.toDate(), // Ensure it is converted to a Date object if it’s a timestamp
        isSynced: data.isSynced,
        val: data.val,
      };
    });
    return historyData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques:', error);
    return [];
  }
};

// Listen for updates on CoursHistorique
export const listenToCryptoHistory = (callback) => {
  const q = query(collection(db, 'CoursHistorique'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const historyData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        idCoursHistorique: doc.id, // Document ID
        idCrypto: data.idCrypto,
        montant: data.montant,
        dateCours: data.dateCours.toDate(), // Ensure it is converted to a Date object
        isSynced: data.isSynced,
        val: data.val,
      };
    });
    callback(historyData);
  });

  // Return unsubscribe function to stop listening when needed
  return unsubscribe;
};
