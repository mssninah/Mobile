import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème
import Footer from '../components/Footer'; // Import Footer
import { getWallet } from '../services/walletService'; // Import du service

export default function WalletScreen() {
  const { darkMode } = useTheme(); // Récupération du thème actuel
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalAmount = 30000; // Balance totale statique pour le moment

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Styles selon le thème

  useEffect(() => {
    const fetchCryptos = async () => {
      setLoading(true);
      try {
        const walletData = await getWallet();

        // Transformation des données récupérées pour l'affichage
        const transformedData = walletData.map((wallet) => ({
          id: wallet.idPortefeuille,
          name: `Crypto ${wallet.idCrypto}`, // Nom fictif pour chaque crypto
          quantity: parseFloat(wallet.quantite).toFixed(2),
          amount: (parseFloat(wallet.quantite) * 100).toFixed(2), // Montant fictif basé sur un prix statique (100 USD par unité)
        }));

        setCryptos(transformedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du portefeuille :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptos();
  }, []);

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Solde principal */}
      <View style={[styles.walletBalanceContainer, themeStyles.walletBalanceContainer]}>
        <Text style={[styles.walletBalanceText, themeStyles.walletBalanceText]}>Total Balance</Text>
        <Text style={[styles.walletBalanceAmount, themeStyles.walletBalanceAmount]}>
          ${totalAmount.toLocaleString()}
        </Text>
      </View>

      {/* Tableau des cryptomonnaies */}
      <View style={[styles.tableContainer, themeStyles.tableContainer]}>
        <Text style={[styles.tableHeader, themeStyles.tableHeader]}>My Cryptocurrencies</Text>
        {loading ? (
          <Text style={[styles.loadingText, themeStyles.loadingText]}>Loading...</Text>
        ) : (
          <FlatList
            data={cryptos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.tableRow, themeStyles.tableRow]}>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.name}</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.quantity} units</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>${item.amount}</Text>
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
    padding: 16,
  },
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
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  darkTheme: {
    container: { backgroundColor: '#181818' },
    walletBalanceContainer: { backgroundColor: '#2C6E49' },
    walletBalanceText: { color: '#fff' },
    walletBalanceAmount: { color: '#fff' },
    tableContainer: { backgroundColor: '#222222' },
    tableHeader: { color: '#fff' },
    tableRow: { borderBottomColor: '#444' },
    tableCell: { color: '#fff' },
    loadingText: { color: '#fff' },
  },
  lightTheme: {
    container: { backgroundColor: '#f9fafb' },
    walletBalanceContainer: { backgroundColor: '#4CAF50' },
    walletBalanceText: { color: '#fff' },
    walletBalanceAmount: { color: '#fff' },
    tableContainer: { backgroundColor: '#ffffff' },
    tableHeader: { color: '#333' },
    tableRow: { borderBottomColor: '#ddd' },
    tableCell: { color: '#333' },
    loadingText: { color: '#333' },
  },
});
