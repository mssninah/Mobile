import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Footer from '../components/Footer';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème

const CryptoCoursesScreen = () => {
  const { darkMode } = useTheme(); // Accède au mode sombre ou clair
  const cryptos = [
    { id: '1', name: 'Bitcoin', values: [50000, 51000, 49500, 52000, 53000] },
    { id: '2', name: 'Ethereum', values: [1500, 1550, 1520, 1580, 1600] },
    { id: '3', name: 'Binance Coin', values: [300, 310, 290, 320, 330] },
  ];

  const [selectedCrypto, setSelectedCrypto] = useState('all');

  const allValues = cryptos.reduce((acc, crypto) => {
    crypto.values.forEach((val, index) => {
      acc[index] = (acc[index] || 0) + val;
    });
    return acc;
  }, []);

  const chartData = selectedCrypto === 'all'
    ? { labels: ['1', '2', '3', '4', '5'], datasets: [{ data: allValues }] }
    : { labels: ['1', '2', '3', '4', '5'], datasets: [{ data: cryptos.find((c) => c.name === selectedCrypto).values }] };

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Applique les styles du mode sombre ou clair

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.header, themeStyles.header]}>Crypto Courses</Text>

      {/* Scrollable list for selecting cryptocurrency */}
      <ScrollView
        style={[styles.scrollContainer, themeStyles.scrollContainer]}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <TouchableOpacity
          style={[styles.cryptoButton, selectedCrypto === 'all' && styles.selectedButton, themeStyles.cryptoButton]}
          onPress={() => setSelectedCrypto('all')}
        >
          <Text style={[styles.cryptoButtonText, themeStyles.cryptoButtonText]}>All Cryptos</Text>
        </TouchableOpacity>
        {cryptos.map((crypto) => (
          <TouchableOpacity
            key={crypto.id}
            style={[styles.cryptoButton, selectedCrypto === crypto.name && styles.selectedButton, themeStyles.cryptoButton]}
            onPress={() => setSelectedCrypto(crypto.name)}
          >
            <Text style={[styles.cryptoButtonText, themeStyles.cryptoButtonText]}>{crypto.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Scrollable chart view */}
      <ScrollView
        style={[styles.chartContainer, themeStyles.chartContainer]}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text style={[styles.chartTitle, themeStyles.chartTitle]}>
          {selectedCrypto === 'all' ? 'Combined Chart of All Cryptos' : `Value Chart: ${selectedCrypto}`}
        </Text>
        <LineChart
          data={chartData}
          width={340}
          height={220}
          chartConfig={{
            backgroundColor: '#1E293B',
            backgroundGradientFrom: '#3B82F6',
            backgroundGradientTo: '#2563EB',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
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
  scrollContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  cryptoButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#60A5FA',
  },
  cryptoButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  chartContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },

  // Dark Theme Styles
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    header: {
      color: '#fff',
    },
    cryptoButton: {
      backgroundColor: '#333',
    },
    cryptoButtonText: {
      color: '#fff',
    },
    chartContainer: {
      backgroundColor: '#333',
    },
    chartTitle: {
      color: '#fff',
    },
    scrollContainer: {
      backgroundColor: '#1F2937',
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
    cryptoButton: {
      backgroundColor: '#ffffff',
    },
    cryptoButtonText: {
      color: '#1F2937',
    },
    chartContainer: {
      backgroundColor: '#ffffff',
    },
    chartTitle: {
      color: '#1F2937',
    },
    scrollContainer: {
      backgroundColor: '#f9fafb',
    },
  },
});

export default CryptoCoursesScreen;
