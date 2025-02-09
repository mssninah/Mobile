import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème
import Footer from '../components/Footer';
import { getUserTransactions } from '../services/transactionService'; // Service importé

export default function TransactionHistoryScreen() {
  const { darkMode } = useTheme(); // Récupère le mode actuel
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getUserTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
        {loading ? (
          <ActivityIndicator size="large" color="#4B9CD3" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.tableRow, themeStyles.tableRow]}>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.crypto}</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.type}</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>
                  ${parseFloat(item.amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>

                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.date}</Text>
              </View>
            )}
          />
        )}
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
    borderBottomWidth: 2,
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
    paddingVertical: 8,
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
