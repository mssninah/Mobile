import { db } from '../config/firebase-config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fonction pour récupérer le portefeuille de l'utilisateur connecté
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

    // Récupérer les documents du portefeuille associés à l'utilisateur
    const portefeuilleQuery = query(
      collection(db, 'Portefeuilles'),
      where('idUser', '==', idUser)
    );

    const querySnapshot = await getDocs(portefeuilleQuery);

    const wallets = [];
    querySnapshot.forEach((doc) => {
      wallets.push({ id: doc.id, ...doc.data() });
    });

    console.log("💰 Données du portefeuille récupérées :", wallets);
    return wallets;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du portefeuille :", error);
    return [];
  }
};
