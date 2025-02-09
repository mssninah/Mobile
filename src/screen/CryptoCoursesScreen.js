import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Footer from '../components/Footer';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème
import { getCryptoRates, listenToCryptoRates } from '../services/cryptoService'; // Import des fonctions de service
import { useNavigation } from '@react-navigation/native';

const CryptoCoursesScreen = () => {
  const navigation = useNavigation();
  const { darkMode } = useTheme(); // Accède au mode sombre ou clair
  const [cryptos, setCryptos] = useState([]); // État pour stocker les données des cryptos

  // Récupère les données au montage du composant
  useEffect(() => {
    const fetchCryptoRates = async () => {
      const data = await getCryptoRates();
      setCryptos(data); // Mettre à jour les cryptos récupérées
    };

    fetchCryptoRates();

    // Écoute en temps réel
    listenToCryptoRates(setCryptos);
  }, []);

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Applique les styles du mode sombre ou clair

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.header, themeStyles.header]}>Crypto Courses</Text>

      {/* Bouton pour voir la courbe */}
      <TouchableOpacity
        style={[styles.button, themeStyles.button]}
        onPress={() => navigation.navigate('CryptoGraphe')} // Redirige vers CryptoGrapheScreen
      >
        <Text style={[styles.buttonText, themeStyles.buttonText]}>Voir la courbe</Text>
      </TouchableOpacity>

      {/* Affichage des cryptos */}
      <ScrollView style={[styles.cryptoList, themeStyles.cryptoList]}>
        {cryptos.map((crypto, index) => (
          <View key={`${crypto.name}-${index}`} style={[styles.cryptoItem, themeStyles.cryptoItem]}>
            <Text style={[styles.cryptoName, themeStyles.cryptoName]}>
              {crypto.name}
            </Text>
            <Text style={[styles.cryptoDetails, themeStyles.cryptoDetails]}>
              Valeur: {crypto.val}
            </Text>
            <Text style={[styles.cryptoDetails, themeStyles.cryptoDetails]}>
              Montant: {crypto.montant}
            </Text>
            <Text style={[styles.cryptoDetails, themeStyles.cryptoDetails]}>
              Dernière mise à jour: {crypto.dateCours}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1e40af', // Bleu roi
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  cryptoList: {
    marginTop: 16,
    padding: 8,
  },
  cryptoItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cryptoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cryptoDetails: {
    fontSize: 16,
    marginTop: 4,
  },

  // Dark Theme Styles
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    header: {
      color: '#fff',
    },
    button: {
      backgroundColor: '#1e40af',
    },
    buttonText: {
      color: '#fff',
    },
    cryptoList: {
      backgroundColor: '#1c1c1c',
    },
    cryptoItem: {
      backgroundColor: '#333',
    },
    cryptoName: {
      color: '#fff',
    },
    cryptoDetails: {
      color: '#bbb',
    },
  },

  // Light Theme Styles
  lightTheme: {
    container: {
      backgroundColor: '#f1f5f9',
    },
    header: {
      color: '#1F2937',
    },
    button: {
      backgroundColor: '#1e40af',
    },
    buttonText: {
      color: '#fff',
    },
    cryptoList: {
      backgroundColor: '#ffffff',
    },
    cryptoItem: {
      backgroundColor: '#f9fafb',
    },
    cryptoName: {
      color: '#1F2937',
    },
    cryptoDetails: {
      color: '#555',
    },
  },
});

export default CryptoCoursesScreen;
