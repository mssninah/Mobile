import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, CheckBox, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import de useNavigation
import { fetchCryptoHistory, listenToCryptoHistory } from '../services/cryptoHistoryService'; // Import des services


// une liste de tout les crypto monnaie, 
//avec checkbox
//on affiche une la courbe des cryptos checker dnas le hcheckbox


//nb montan est encore de type string

// le graphe est par rapoort au montant de la cryptomonnaie 
//une courbe des montant


const CryptoGrapheScreen = () => {
  const navigation = useNavigation(); // Utiliser le hook pour la navigation
  const [graphData, setGraphData] = useState(null); // État pour les données du graphique
  const [selectedCryptos, setSelectedCryptos] = useState([]); // Liste des cryptos sélectionnées

  // Utiliser useEffect pour charger les données au montage du composant
  useEffect(() => {
    // Fonction pour récupérer les données historiques
    const fetchHistoricalData = async () => {
      const data = await fetchCryptoHistory();
      setGraphData(data);
    };

    // Appel à la fonction de récupération des données
    fetchHistoricalData();

    // Écoute des mises à jour en temps réel
    const unsubscribe = listenToCryptoHistory((updatedData) => {
      setGraphData(updatedData); // Mettre à jour les données du graphique lors des mises à jour
    });

    // Nettoyage: arrêter d'écouter lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, []);

  // Fonction pour gérer la sélection des cryptos
  const handleSelectCrypto = (cryptoId) => {
    setSelectedCryptos(prevState => {
      if (prevState.includes(cryptoId)) {
        // Si la crypto est déjà sélectionnée, on la retire
        return prevState.filter(id => id !== cryptoId);
      } else {
        // Sinon, on l'ajoute à la sélection
        return [...prevState, cryptoId];
      }
    });
  };

  // Fonction pour filtrer les données en fonction des cryptos sélectionnées
  const filterGraphData = () => {
    if (!graphData || selectedCryptos.length === 0) return [];

    return graphData.filter(item => selectedCryptos.includes(item.idCrypto));
  };

  const filteredGraphData = filterGraphData();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Graphique des Cryptos</Text>

      {/* Liste des cryptos à sélectionner */}
      <ScrollView style={styles.cryptoList}>
        {graphData?.map((crypto) => (
          <View key={crypto.idCrypto} style={styles.cryptoItem}>
            <CheckBox
              value={selectedCryptos.includes(crypto.idCrypto)}
              onValueChange={() => handleSelectCrypto(crypto.idCrypto)}
            />
            <Text style={styles.cryptoName}>{crypto.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Affichage des données du graphique */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphText}>
          {filteredGraphData.length > 0
            ? `Données des cryptos sélectionnées: ${filteredGraphData.map(item => item.montant).join(', ')}`
            : 'Sélectionnez les cryptos pour afficher les courbes...'}
        </Text>
      </View>

      {/* Retour à l'écran précédent */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
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
  },
  cryptoList: {
    marginBottom: 20,
    padding: 10,
  },
  cryptoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cryptoName: {
    fontSize: 16,
    marginLeft: 10,
  },
  graphContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e4e4e4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  graphText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CryptoGrapheScreen;
