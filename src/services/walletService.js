import { db } from '../config/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';



export const getTotalBalance = async () => {
  try {
    console.log("🔍 Récupération du solde total de l'utilisateur connecté...");

    // Récupérer l'utilisateur connecté depuis AsyncStorage
    const authConnected = await AsyncStorage.getItem('auth_connected');
    if (!authConnected) {
      throw new Error("❌ Aucun utilisateur connecté trouvé.");
    }

    const { idUser } = JSON.parse(authConnected);
    console.log("👤 ID de l'utilisateur connecté :", idUser);

    // Récupérer tous les documents de la collection "Fonds"
    const fondsQuery = query(collection(db, 'Fonds'));
    const querySnapshot = await getDocs(fondsQuery);

    // Initialiser le solde total
    let totalBalance = 0;

    // Parcourir les documents récupérés
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      console.log("📄 Document analysé :", data);

      // Vérifier si le document appartient à l'utilisateur connecté
      if (data.utilisateur?.iduser.toString() === idUser.toString()) {
        console.log("🎯 Document correspondant :", data);

        // Convertir la valeur en nombre et l'ajouter au total
        const valeur = parseFloat(data.valeur);
        if (!isNaN(valeur)) {
          totalBalance += valeur;
        } else {
          console.warn("⚠️ La valeur est invalide :", data.valeur);
        }
      }
    });

    console.log("💰 Solde total de l'utilisateur :", totalBalance);
    return totalBalance.toFixed(2); // Retourner le solde formaté
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du solde total :", error);
    return 0; // Retourne 0 en cas d'erreur
  }
};



export const getWallet = async () => {
  try {
    console.log("🔍 Récupération des informations de l'utilisateur connecté...");

    // Récupérer l'utilisateur connecté depuis AsyncStorage
    const authConnected = await AsyncStorage.getItem('auth_connected');
    if (!authConnected) {
      throw new Error("❌ Aucun utilisateur connecté trouvé.");
    }

    const { idUser } = JSON.parse(authConnected);
    console.log("👤 ID de l'utilisateur connecté :", idUser);

    // Récupérer tous les documents de la collection "Portefeuilles"
    const portefeuilleQuery = query(collection(db, 'Portefeuilles'));
    const querySnapshot = await getDocs(portefeuilleQuery);

    // Initialiser un objet pour regrouper les cryptos par idCrypto
    const cryptoData = {};

    // Parcourir les documents récupérés
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { idCrypto, quantite, idUser: userId } = data;

      // Vérifier si le document appartient à l'utilisateur connecté
      if (userId.toString() === idUser.toString()) {
        console.log("🎯 Document correspondant :", data);

        // Ajouter la quantité de la crypto au total
        if (!cryptoData[idCrypto]) {
          cryptoData[idCrypto] = 0;
        }
        cryptoData[idCrypto] += parseFloat(quantite);
      } else {
        console.warn("⛔ Document ignoré, utilisateur non correspondant :", userId);
      }
    });

    // Transformer les données en tableau formaté pour l'affichage
    const wallets = Object.keys(cryptoData).map((idCrypto) => ({
      id: idCrypto,
      quantity: cryptoData[idCrypto].toFixed(2),
    }));

    console.log("💰 Données du portefeuille récupérées :", wallets);
    return wallets;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du portefeuille :", error);
    return [];
  }
};
