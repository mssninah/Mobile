import { db } from '../config/firebase-config'; // Assurez-vous que Firebase est bien configuré
import { getDocs, collection, onSnapshot } from 'firebase/firestore';

// Fonction pour récupérer les données de la collection Cours
export const getCryptoRates = async () => {
  try {
    console.log('Début de la récupération des données');

    if (!db) {
      console.error('Firebase db n\'est pas initialisé');
      return [];
    }

    const cryptoCollectionRef = collection(db, 'Cours');
    console.log('Référence à la collection "Cours" obtenue :', cryptoCollectionRef);

    
    const querySnapshot = await getDocs(cryptoCollectionRef);
    console.log('Données récupérées avec succès, nombre de documents:', querySnapshot.size);

    const cryptoData = [];
    querySnapshot.forEach((doc) => {
      console.log('Traitement du document:', doc.id);
      const data = doc.data();
      console.log('Données du document:', data);

      // Nettoyage du montant : enlever tous les caractères non numériques (sauf le point décimal)
      let montantString = data.montant;
      console.log('Montant brut:', montantString);

      // Nettoyage pour enlever les caractères non numériques
      montantString = montantString.replace(/[^0-9.-]+/g, '');
      console.log('Montant nettoyé:', montantString);

      // Conversion en nombre
      const montant = parseFloat(montantString);
      console.log('Montant après parseFloat:', montant);

      // Vérifier si le montant est un nombre valide
      if (isNaN(montant)) {
        console.error(`Montant invalide pour ${data.cryptomonnaie.description}:`, montantString);
      }

      // Si montant invalide, on remplace par 0
      const isValidMontant = !isNaN(montant) && montant !== null;
      console.log('Montant valide?', isValidMontant);

      cryptoData.push({
        id: data.cryptomonnaie.idCrypto,
        name: data.cryptomonnaie.description,
        val: data.cryptomonnaie.val,
        montant: isValidMontant ? montant : 0, // Si montant invalide, on le remplace par 0
        isSynced: data.isSynced,
        dateCours: data.dateCours.toDate().toLocaleString(), // Convertir en date lisible
      });
    });

    if (cryptoData.length === 0) {
      console.warn('Aucune donnée récupérée');
    }

    console.log('Données finales:', cryptoData);
    return cryptoData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return [];
  }
};

// Fonction pour écouter en temps réel les modifications dans la collection Cours
export const listenToCryptoRates = (setCryptoRates) => {
  const cryptoCollectionRef = collection(db, 'Cours');

  console.log('Écoute en temps réel des modifications sur la collection Cours');

  onSnapshot(cryptoCollectionRef, (querySnapshot) => {
    console.log('Changement détecté dans la collection Cours, nombre de documents:', querySnapshot.size);
    const cryptoData = [];
    querySnapshot.forEach((doc) => {
      console.log('Traitement du document:', doc.id);
      const data = doc.data();
      console.log('Données du document:', data);

      // Nettoyage du montant : enlever tous les caractères non numériques (sauf le point décimal)
      let montantString = data.montant;
      console.log('Montant brut:', montantString);

      // Nettoyage pour enlever les caractères non numériques
      montantString = montantString.replace(/[^0-9.-]+/g, '');
      console.log('Montant nettoyé:', montantString);

      // Conversion en nombre
      const montant = parseFloat(montantString);
      console.log('Montant après parseFloat:', montant);

      // Vérifier si le montant est un nombre valide
      if (isNaN(montant)) {
        console.error(`Montant invalide pour ${data.cryptomonnaie.description}:`, montantString);
      }

      // Si montant invalide, on remplace par 0
      const isValidMontant = !isNaN(montant) && montant !== null;
      console.log('Montant valide?', isValidMontant);

      cryptoData.push({
        id: data.cryptomonnaie.idCrypto,
        name: data.cryptomonnaie.description,
        val: data.cryptomonnaie.val,
        montant: isValidMontant ? montant : 0, // Si montant invalide, on le remplace par 0
        isSynced: data.isSynced,
        dateCours: data.dateCours.toDate().toLocaleString(),
      });
    });

    if (cryptoData.length === 0) {
      console.warn('Aucune donnée mise à jour');
    }

    console.log('Données mises à jour:', cryptoData);
    setCryptoRates(cryptoData); // Mettre à jour les données en temps réel
  });
};
