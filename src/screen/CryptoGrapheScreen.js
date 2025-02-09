// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { getCryptoRates } from '../services/cryptoService';
// import { getCryptoHistory, listenToCryptoHistoryUpdates } from '../services/cryptoHistoryService';

// // Fonction pour générer une couleur hexadécimale aléatoire
// const getRandomColor = (existingColors) => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
  
//   // Vérifie si la couleur existe déjà
//   while (existingColors.includes(color)) {
//     color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//   }

//   return color;
// };

// const CryptoGrapheScreen = () => {
//   const [cryptos, setCryptos] = useState([]); // Liste des cryptos disponibles
//   const [selectedCryptos, setSelectedCryptos] = useState([]); // Cryptos sélectionnées
//   const [cryptoHistory, setCryptoHistory] = useState({}); // Historique des cryptos sélectionnées
//   const [cryptoColors, setCryptoColors] = useState({}); // Couleurs générées pour chaque crypto

//   // Récupérer la liste des cryptos disponibles
//   useEffect(() => {
//     const fetchCryptos = async () => {
//       const data = await getCryptoRates(); // Appel au service pour récupérer les cryptos
//       setCryptos(data); // Mettre à jour l'état avec les cryptos disponibles

//       // Générer une couleur unique pour chaque crypto
//       const colors = {};
//       const existingColors = [];
//       data.forEach((crypto) => {
//         const color = getRandomColor(existingColors); // Générer une couleur unique pour chaque crypto
//         colors[crypto.id] = color;
//         existingColors.push(color); // Ajouter cette couleur à la liste des couleurs existantes
//       });

//       setCryptoColors(colors);
//     };

//     fetchCryptos();
//   }, []);

//   // Fonction pour gérer la sélection d'une crypto
//   const handleSelectCrypto = async (crypto) => {
//     if (selectedCryptos.includes(crypto.id)) {
//       setSelectedCryptos(selectedCryptos.filter((id) => id !== crypto.id)); // Désélectionner la crypto
//     } else {
//       setSelectedCryptos([...selectedCryptos, crypto.id]); // Sélectionner la crypto
//     }
//   };

//   // Fonction pour récupérer l'historique de la crypto
//   useEffect(() => {
//     // Ne commencer à écouter que si des cryptos sont sélectionnées
//     if (selectedCryptos.length > 0) {
//       selectedCryptos.forEach(async (cryptoId) => {
//         // Récupérer les données historiques si elles ne sont pas déjà présentes
//         if (!cryptoHistory[cryptoId]) {
//           const historyData = await getCryptoHistory(cryptoId); // Récupérer l'historique pour cette crypto
//           setCryptoHistory((prevData) => ({
//             ...prevData,
//             [cryptoId]: historyData,
//           }));
//         }

//         // Écoute des mises à jour en temps réel
//         const unsubscribe = listenToCryptoHistoryUpdates(cryptoId, (updatedHistory) => {
//           setCryptoHistory((prevData) => ({
//             ...prevData,
//             [cryptoId]: updatedHistory,
//           }));
//         });

//         // Retourner la fonction de nettoyage pour arrêter l'écoute en cas de changement de crypto
//         return () => unsubscribe();
//       });
//     }
//   }, [selectedCryptos, cryptoHistory]); // Cette useEffect se déclenche chaque fois qu'un crypto est ajoutée ou enlevée

//   // Préparer les données du graphique pour chaque crypto sélectionnée
//   const chartData = {
//     labels: selectedCryptos.length > 0 && cryptoHistory[selectedCryptos[0]] ? 
//       cryptoHistory[selectedCryptos[0]].map(entry => new Date(entry.dateCours).toLocaleTimeString()) : [], // Labels des heures
//     datasets: selectedCryptos.map((cryptoId) => ({
//       data: cryptoHistory[cryptoId]?.map(entry => parseFloat(entry.montant)) || [],
//       strokeWidth: 2,
//       color: () => cryptoColors[cryptoId], // Utilise la couleur générée pour chaque crypto
//     }))
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Graphique des Cryptos</Text>

//       {/* Liste des cryptos disponibles */}
//       <ScrollView style={styles.cryptoList}>
//         {cryptos.map((crypto) => (
//           <TouchableOpacity
//             key={crypto.id}
//             style={styles.cryptoItem}
//             onPress={() => handleSelectCrypto(crypto)} // Sélectionner ou désélectionner une crypto
//           >
//             <View
//               style={[
//                 styles.checkbox,
//                 {
//                   borderColor: cryptoColors[crypto.id],
//                   backgroundColor: selectedCryptos.includes(crypto.id) ? cryptoColors[crypto.id] : 'transparent',
//                 },
//               ]}
//             />
//             <Text style={styles.cryptoName}>{crypto.name}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* Légende des cryptos sélectionnées */}
//       <View style={styles.legendContainer}>
//         {selectedCryptos.length > 0 && selectedCryptos.map((cryptoId) => (
//           <View key={cryptoId} style={styles.legendItem}>
//             <View style={[styles.legendColorBox, { backgroundColor: cryptoColors[cryptoId] }]} />
//             <Text>{cryptos.find(crypto => crypto.id === cryptoId)?.name}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Affichage du graphique */}
//       <View style={styles.graphContainer}>
//         {selectedCryptos.length > 0 ? (
//           <LineChart
//             data={chartData}
//             width={Dimensions.get('window').width - 32}
//             height={300}
//             chartConfig={{
//               backgroundColor: '#1c313a',
//               backgroundGradientFrom: '#457b9d',
//               backgroundGradientTo: '#1d3557',
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//               style: { borderRadius: 8 },
//               propsForDots: {
//                 r: '6',
//                 strokeWidth: '2',
//                 stroke: '#ffa726',
//               },
//             }}
//             bezier
//             style={styles.chart}
//           />
//         ) : (
//           <Text style={styles.graphText}>Sélectionnez des cryptos pour afficher le graphique.</Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f1f5f9',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#1e3a8a',
//   },
//   cryptoList: {
//     maxHeight: 150,
//     marginBottom: 20,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     padding: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cryptoItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   cryptoName: {
//     fontSize: 16,
//   },
//   legendContainer: {
//     marginBottom: 20,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   legendColorBox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     marginRight: 10,
//   },
//   graphContainer: {
//     alignItems: 'center',
//   },
//   graphText: {
//     fontSize: 16,
//     color: '#1e3a8a',
//   },
//   chart: {
//     borderRadius: 8,
//     marginBottom: 20,
//   },
// });

// export default CryptoGrapheScreen;


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
    setCryptoHistory([]); // Réinitialiser l'historique chaque fois qu'une nouvelle crypto est sélectionnée

    // Récupérer les données historiques initiales
    const historyData = await getCryptoHistory(crypto.id);
    setCryptoHistory(historyData); // Afficher les données historiques initiales

    // Écoute des mises à jour en temps réel
    const unsubscribe = listenToCryptoHistoryUpdates(crypto.id, (updatedHistory) => {
      setCryptoHistory(updatedHistory); // Mettre à jour l'historique en temps réel
    });

    // Retourner une fonction de nettoyage pour arrêter l'écoute en cas de changement de crypto
    return () => unsubscribe();
  };

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
