import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème
import Footer from '../components/Footer'; // Import Footer

export default function WalletScreen() {
  const { darkMode } = useTheme(); // Get the current theme mode
  const [cryptos, setCryptos] = useState([
    { id: '1', name: 'Bitcoin', quantity: 0.5, amount: 25000 },
    { id: '2', name: 'Ethereum', quantity: 2, amount: 3200 },
    { id: '3', name: 'Binance Coin', quantity: 10, amount: 3000 },
  ]);

  const totalAmount = cryptos.reduce((sum, crypto) => sum + crypto.amount, 0);

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Set styles based on the theme

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Main wallet balance */}
      <View style={[styles.walletBalanceContainer, themeStyles.walletBalanceContainer]}>
        <Text style={[styles.walletBalanceText, themeStyles.walletBalanceText]}>Total Balance</Text>
        <Text style={[styles.walletBalanceAmount, themeStyles.walletBalanceAmount]}>
          ${totalAmount.toLocaleString()}
        </Text>
      </View>

      {/* Crypto holdings table */}
      <View style={[styles.tableContainer, themeStyles.tableContainer]}>
        <Text style={[styles.tableHeader, themeStyles.tableHeader]}>My Cryptocurrencies</Text>
        <FlatList
          data={cryptos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.tableRow, themeStyles.tableRow]}>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.name}</Text>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.quantity} units</Text>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>${item.amount.toLocaleString()}</Text>
            </View>
          )}
        />
      </View>

      {/* Footer */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  // Common Styles
  walletBalanceContainer: {
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  walletBalanceText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  walletBalanceAmount: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Dark Theme Styles
  darkTheme: {
    container: {
      backgroundColor: '#181818',
    },
    walletBalanceContainer: {
      backgroundColor: '#2C6E49', // Dark green background for wallet balance
    },
    walletBalanceText: {
      color: '#fff',
    },
    walletBalanceAmount: {
      color: '#fff',
    },
    tableContainer: {
      backgroundColor: '#222222',
    },
    tableHeader: {
      color: '#fff',
    },
    tableRow: {
      borderBottomColor: '#444',
    },
    tableCell: {
      color: '#fff',
    },
  },

  // Light Theme Styles
  lightTheme: {
    container: {
      backgroundColor: '#f9fafb',
    },
    walletBalanceContainer: {
      backgroundColor: '#4CAF50', // Green background for wallet balance
    },
    walletBalanceText: {
      color: '#fff',
    },
    walletBalanceAmount: {
      color: '#fff',
    },
    tableContainer: {
      backgroundColor: '#ffffff',
    },
    tableHeader: {
      color: '#333',
    },
    tableRow: {
      borderBottomColor: '#ddd',
    },
    tableCell: {
      color: '#333',
    },
  },
});
