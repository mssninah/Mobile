import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getCryptoRates } from '../services/cryptoService';
import { getCryptoHistory, listenToCryptoHistoryUpdates } from '../services/cryptoHistoryService';

const CryptoGrapheScreen = () => {
  const [cryptos, setCryptos] = useState([]); // Liste des cryptos disponibles
  const [selectedCrypto, setSelectedCrypto] = useState(null); // Crypto sélectionnée
  const [cryptoHistory, setCryptoHistory] = useState([]); // Historique de la crypto sélectionnée

  // Récupérer la liste des cryptos disponibles
  useEffect(() => {
    const fetchCryptos = async () => {
      const data = await getCryptoRates(); // Appel au service pour récupérer les cryptos
      setCryptos(data); // Mettre à jour l'état avec les cryptos disponibles
    };

    fetchCryptos();
  }, []);

  // Fonction pour gérer la sélection d'une crypto
  const handleSelectCrypto = async (crypto) => {
    setSelectedCrypto(crypto); // Mettre à jour la crypto sélectionnée

    // Récupérer les données historiques initiales
    const historyData = await getCryptoHistory(crypto.id);
    setCryptoHistory(historyData); // Afficher les données historiques initiales

    // Écoute des mises à jour en temps réel
    const unsubscribe = listenToCryptoHistoryUpdates(crypto.id, (updatedHistory) => {
      setCryptoHistory((prevHistory) => [...prevHistory, ...updatedHistory]); // Ajouter les nouvelles données à l'historique existant
    });

    // Retourner une fonction de nettoyage pour arrêter l'écoute en cas de changement de crypto
    return () => unsubscribe();
  };

  useEffect(() => {
    // Fonction de nettoyage de l'abonnement à l'historique
    return () => {
      if (selectedCrypto) {
        listenToCryptoHistoryUpdates(selectedCrypto.id, () => {});
      }
    };
  }, [selectedCrypto]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Détails des Cryptos</Text>

      {/* Liste des cryptos disponibles */}
      <ScrollView style={styles.cryptoList}>
        {cryptos.map((crypto) => (
          <TouchableOpacity
            key={crypto.id}
            style={styles.cryptoItem}
            onPress={() => handleSelectCrypto(crypto)} // Sélectionner une crypto
          >
            <Text style={styles.cryptoName}>{crypto.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Détails de la crypto sélectionnée */}
      <View style={styles.detailsContainer}>
        {selectedCrypto ? (
          <>
            <Text style={styles.detailsHeader}>Détails de {selectedCrypto.name}</Text>
            <Text>ID: {selectedCrypto.id}</Text>
            <Text>Symbol: {selectedCrypto.symbol}</Text>
            <Text>Prix actuel: {selectedCrypto.currentPrice} USD</Text>

            <Text style={styles.historyHeader}>Historique :</Text>
            <ScrollView style={styles.historyList}>
              {cryptoHistory.length > 0 ? (
                cryptoHistory.map((entry, index) => (
                  <Text key={index}>
                    {entry.dateCours.toLocaleString()} : {entry.montant} USD
                  </Text>
                ))
              ) : (
                <Text>Aucun historique disponible.</Text>
              )}
            </ScrollView>
          </>
        ) : (
          <Text style={styles.noSelectionText}>Sélectionnez une crypto pour voir les détails.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e3a8a',
  },
  cryptoList: {
    maxHeight: 150,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cryptoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cryptoName: {
    fontSize: 16,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
  },
  historyHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1e40af',
  },
  historyList: {
    maxHeight: 200, // Définir une hauteur pour permettre le défilement
  },
  noSelectionText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default CryptoGrapheScreen;
