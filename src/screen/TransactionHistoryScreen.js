import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème
import Footer from '../components/Footer';

export default function TransactionHistoryScreen() {
  const { darkMode } = useTheme(); // Récupère le mode actuel
  const [transactions, setTransactions] = useState([
    { id: '1', crypto: 'Bitcoin', type: 'Achat', quantity: 0.1, amount: 5000, date: '2023-02-01' },
    { id: '2', crypto: 'Ethereum', type: 'Vente', quantity: 0.5, amount: 1600, date: '2023-02-05' },
    { id: '3', crypto: 'Binance Coin', type: 'Achat', quantity: 5, amount: 1500, date: '2023-02-10' },
  ]);

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Applique les styles selon le mode

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <Text style={[styles.header, themeStyles.header]}>Historique des Transactions</Text>

      {/* Transactions Table */}
      <View style={[styles.tableContainer, themeStyles.tableContainer]}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeaderCell, themeStyles.tableHeaderCell]}>Crypto</Text>
          <Text style={[styles.tableHeaderCell, themeStyles.tableHeaderCell]}>Type</Text>
          <Text style={[styles.tableHeaderCell, themeStyles.tableHeaderCell]}>Quantité</Text>
          <Text style={[styles.tableHeaderCell, themeStyles.tableHeaderCell]}>Montant</Text>
          <Text style={[styles.tableHeaderCell, themeStyles.tableHeaderCell]}>Date</Text>
        </View>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.tableRow, themeStyles.tableRow]}>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.crypto}</Text>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.type}</Text>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>${item.amount.toLocaleString()}</Text>
              <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.date}</Text>
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
    padding: 20,
    borderRadius: 10,
  },

  // Common Styles
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 12,
    marginBottom: 16,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },

  // Dark Theme Styles
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    header: {
      color: '#fff',
    },
    tableContainer: {
      backgroundColor: '#1E1E1E',
    },
    tableHeaderCell: {
      color: '#FFDD57', // Gold accent color
    },
    tableRow: {
      borderBottomColor: '#333',
    },
    tableCell: {
      color: '#DDD',
    },
  },

  // Light Theme Styles
  lightTheme: {
    container: {
      backgroundColor: '#f5f5f5',
    },
    header: {
      color: '#2F4F4F', // Dark Slate Gray color
    },
    tableContainer: {
      backgroundColor: '#fff',
    },
    tableHeaderCell: {
      color: '#4B9CD3', // Sky Blue accent color
    },
    tableRow: {
      borderBottomColor: '#e0e0e0',
    },
    tableCell: {
      color: '#333',
    },
  },
});
