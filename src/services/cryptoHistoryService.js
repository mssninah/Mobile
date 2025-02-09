import { db } from '../config/firebase-config'; // Assurez-vous que Firebase est bien configuré
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';

// Fonction pour récupérer les données historiques pour une crypto (sur les 10 dernières minutes)
export const getCryptoHistory = async (cryptoId) => {
  try {
    console.log('Récupération des données historiques de la crypto:', cryptoId);

    if (!db) {
      console.error('Firebase db n\'est pas initialisé');
      return [];
    }

    const cryptoHistoryCollectionRef = collection(db, 'CoursHistoriques');
    
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime()- 10 * 60 * 1000); // 10 minutes avant maintenant

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1); // On soustrait 1 jour pour obtenir hier
    yesterday.setHours(15, 30, 0, 0); // Mettre à 15:30:00


    const q = query(
      cryptoHistoryCollectionRef,
      where("idCrypto", "==", cryptoId),
      where("dateCours", ">=", yesterday),
      orderBy("dateCours", "asc")
    );

    // Afficher la requête et la date limite pour les 10 minutes
    console.log("Requête:", q);
    console.log("Date limite:", tenMinutesAgo);
    const querySnapshot = await getDocs(q);
    const historyData = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const montantString = data.montant;

      // Nettoyer la chaîne pour ne garder que les chiffres, le point et le signe "-" pour les nombres négatifs
      const cleanedMontant = montantString.replace(/[^\d.-]/g, '');
      
      // Vérifier si le montant est bien un nombre avant de le convertir
      const montant = parseFloat(cleanedMontant);
      
      if (isNaN(montant)) {
        console.error('Montant invalide pour la crypto', cryptoId, ':', cleanedMontant);
      } else {
        console.log('Montant pour la crypto', cryptoId, ':', montant); // Vérifier la conversion
      }

      historyData.push({
        id: data.idCrypto,
        montant, // Utilisation du montant proprement converti
        dateCours: data.dateCours.toDate(), // Convertir le timestamp en date
      });
    });

    console.log('Données historiques récupérées:', historyData); // Vérifier les données récupérées
    return historyData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques:', error);
    return [];
  }
};

export const listenToCryptoHistoryUpdates = (cryptoId, setHistoryData) => {
  try {
    console.log('Écoute des mises à jour des données historiques pour la crypto:', cryptoId);

    const cryptoHistoryCollectionRef = collection(db, 'CoursHistoriques');

    // Calcul des 10 dernières minutes
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes avant maintenant

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1); // On soustrait 1 jour pour obtenir hier
    yesterday.setHours(15, 30, 0, 0); // Mettre à 15:30:00

    // Requête Firebase pour écouter en temps réel les nouvelles données de cette crypto
    const q = query(
      cryptoHistoryCollectionRef,
      where("idCrypto", "==", cryptoId),
      where("dateCours", ">=", yesterday),
      orderBy("dateCours", "asc")
    );

    // Mise à jour en temps réel
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedHistoryData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const montantString = data.montant;

        // Nettoyer la chaîne pour ne garder que les chiffres, le point et le signe "-" pour les nombres négatifs
        const cleanedMontant = montantString.replace(/[^\d.-]/g, '');

        // Conversion en float après nettoyage
        const montant = parseFloat(cleanedMontant);

        if (!isNaN(montant)) {
          console.log('Montant mis à jour pour la crypto', cryptoId, ':', montant); // Vérifier la conversion
        } else {
          console.error('Erreur de conversion du montant:', montantString); // Afficher une erreur si la conversion échoue
        }

        updatedHistoryData.push({
          id: data.cryptomonnaie.idCrypto,
          montant,
          dateCours: data.dateCours.toDate(), // Convertir le timestamp en date
        });
      });

      console.log('Mise à jour des données historiques:', updatedHistoryData); // Vérifier les données mises à jour

      // Mettre à jour l'historique dans le state
      setHistoryData(updatedHistoryData);
    });

    return unsubscribe; // Retourner la fonction de nettoyage pour arrêter l'écoute
  } catch (error) {
    console.error('Erreur lors de l\'écoute des mises à jour des données historiques:', error);
    return () => {}; // Retourner une fonction vide en cas d'erreur
  }
};
