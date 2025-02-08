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
  const [selectedCrypto, setSelectedCrypto] = useState(null); // Crypto sélectionnée

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

     

      <TouchableOpacity
            style={[styles.button, themeStyles.button]}
            onPress={() => navigation.navigate('CryptoGraphe')} // Redirige vers CryptoGrapheScreen
          >
            <Text style={[styles.buttonText, themeStyles.buttonText]}>Voir la courbe</Text>
      </TouchableOpacity>

      {/* Affichage des cryptos */}
      <ScrollView style={[styles.cryptoList, themeStyles.cryptoList]}>
        {cryptos.map((crypto, index) => (
          <View key={`${crypto.name}-${index}`} style={styles.cryptoItem}>
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  cryptoList: {
    marginTop: 16,
    padding: 8,
  },
  cryptoItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    picker: {
      backgroundColor: '#333',
      color: '#fff',
    },
    cryptoList: {
      backgroundColor: '#333',
    },
    cryptoName: {
      color: '#fff',
    },
    cryptoDetails: {
      color: '#fff',
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
    picker: {
      backgroundColor: '#ffffff',
      color: '#1F2937',
    },
    cryptoList: {
      backgroundColor: '#ffffff',
    },
    cryptoName: {
      color: '#1F2937',
    },
    cryptoDetails: {
      color: '#1F2937',
    },
  },
});

export default CryptoCoursesScreen;
