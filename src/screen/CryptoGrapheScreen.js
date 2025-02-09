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


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { getCryptoRates } from '../services/cryptoService'; // Importer le service crypto
// import { getCryptoHistory, listenToCryptoHistoryUpdates } from '../services/cryptoHistoryService';

// // Fonction pour générer une couleur hexadécimale aléatoire
// const getRandomColor = (existingColors) => {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   // Génère une couleur aléatoire
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }

//   // Vérifier si cette couleur existe déjà, si oui, régénérer
//   while (existingColors.includes(color)) {
//     color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//   }

//   return color;
// };

// const CryptoGrapheScreen = ({ navigation }) => {
//   const [selectedCryptos, setSelectedCryptos] = useState([]); // Cryptos sélectionnées
//   const [cryptoHistory, setCryptoHistory] = useState({}); // Historique des cryptos sélectionnées
//   const [cryptos, setCryptos] = useState([]); // Liste des cryptos disponibles
//   const [cryptoColors, setCryptoColors] = useState({}); // Couleurs générées pour chaque crypto

//   // Récupérer les cryptos disponibles
//   useEffect(() => {
//     const fetchCryptos = async () => {
//       const data = await getCryptoRates(); // Récupérer la liste des cryptos
//       setCryptos(data); // Mettre à jour la liste des cryptos

//       // Générer une couleur unique pour chaque crypto
//       const colors = {};
//       const existingColors = []; // Liste pour vérifier les couleurs déjà utilisées

//       data.forEach((crypto) => {
//         const color = getRandomColor(existingColors); // Générer une couleur unique
//         colors[crypto.id] = color; // Attribuer la couleur au crypto
//         existingColors.push(color); // Ajouter la couleur à la liste des couleurs utilisées
//       });

//       setCryptoColors(colors); // Mettre à jour l'état des couleurs
//     };

//     fetchCryptos();
//   }, []);

//   // Fonction pour récupérer les données historiques à jour
//   useEffect(() => {
//     selectedCryptos.forEach((cryptoId) => {
//       // Récupérer les données historiques de chaque crypto sélectionnée
//       getCryptoHistory(cryptoId).then((historyData) => {
//         setCryptoHistory((prevData) => ({
//           ...prevData,
//           [cryptoId]: historyData, // Met à jour les données historiques
//         }));
//       });

//       // Écoute en temps réel des données historiques de chaque crypto
//       listenToCryptoHistoryUpdates(cryptoId, (updatedHistoryData) => {
//         setCryptoHistory((prevData) => ({
//           ...prevData,
//           [cryptoId]: updatedHistoryData,
//         }));
//       });
//     });
//   }, [selectedCryptos]);

//   // Gestion de la sélection/désélection des cryptos
//   const handleSelectCrypto = (cryptoId) => {
//     setSelectedCryptos((prevSelected) =>
//       prevSelected.includes(cryptoId)
//         ? prevSelected.filter((id) => id !== cryptoId)
//         : [...prevSelected, cryptoId]
//     );
//   };

//   // Filtrer les données des cryptos sélectionnées
//   const filteredData = cryptos.filter((crypto) => selectedCryptos.includes(crypto.id));

//   // Préparer les données pour le graphique


//   // Préparer les données pour le graphique
// const chartData = {
//   labels: ['10 min', '9 min', '8 min', '7 min', '6 min'], // Labels des 10 dernières minutes
//   datasets: filteredData.map((crypto) => ({
//     data: cryptoHistory[crypto.id]?.map((entry) => entry.montant) || [], // Récupère les montants historiques
//     color: () => cryptoColors[crypto.id], // Utilise la couleur unique associée à chaque crypto
//     strokeWidth: 2,
//   })),
// };

// return (
//   <View style={styles.container}>
//     <Text style={styles.header}>Graphique des Cryptos</Text>

//     {/* Liste des cryptos disponibles */}
//     <ScrollView style={styles.cryptoList}>
//       {cryptos.map((crypto) => (
//         <TouchableOpacity
//           key={crypto.id} // Ajout du "key" unique ici
//           style={styles.cryptoItem}
//           onPress={() => handleSelectCrypto(crypto.id)} // Sélectionner une crypto
//         >
//           <View
//             style={[
//               styles.checkbox,
//               { borderColor: cryptoColors[crypto.id], backgroundColor: selectedCryptos.includes(crypto.id) ? cryptoColors[crypto.id] : 'transparent' },
//             ]}
//           />
//           <Text style={styles.cryptoName}>{crypto.name}</Text> {/* Assurez-vous d'utiliser 'name' ou un autre champ valide */}
//         </TouchableOpacity>
//       ))}
//     </ScrollView>

//     {/* Affichage du graphique */}
//     <View style={styles.graphContainer}>
//       {filteredData.length > 0 ? (
//         <>
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
//           {/* Légende des courbes */}
//           <View style={styles.legendContainer}>
//             {filteredData.map((crypto) => (
//               <View key={crypto.id} style={styles.legendItem}>
//                 <View style={[styles.legendColor, { backgroundColor: cryptoColors[crypto.id] }]} />
//                 <Text style={styles.legendText}>{crypto.name}</Text> {/* Assurez-vous d'utiliser 'name' ou un autre champ valide */}
//               </View>
//             ))}
//           </View>
//         </>
//       ) : (
//         <Text style={styles.graphText}>
//           Sélectionnez des cryptos pour afficher le graphique.
//         </Text>
//       )}
//     </View>
//   </View>
// );

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
//     maxHeight: 150, // Limite la hauteur pour permettre le défilement
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
//   graphContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   graphText: {
//     fontSize: 16,
//     color: '#6c757d',
//     textAlign: 'center',
//   },
//   chart: {
//     borderRadius: 8,
//   },
//   legendContainer: {
//     marginTop: 10,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 10,
//     marginBottom: 5,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 5,
//   },
//   legendText: {
//     fontSize: 14,
//     color: '#333',
//   },
// });

// export default CryptoGrapheScreen;
