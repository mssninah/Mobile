import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème
import Footer from '../components/Footer'; // Import Footer
import { getWallet, getTotalBalance } from '../services/walletService'; // Import du service
import { getCryptoRates } from '../services/cryptoService';

export default function WalletScreen() {
  const { darkMode } = useTheme(); // Récupération du thème actuel
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Styles selon le thème

  useEffect(() => {
    const fetchCryptos = async () => {
      setLoading(true);
      try {
        // Récupérer les données du portefeuille
        const walletData = await getWallet();
    
        // Récupérer les cours des cryptos
        const cryptoRates = await getCryptoRates();
    
        // Associer les données du portefeuille avec les cours des cryptos
        const transformedData = walletData.map((wallet) => {
          const cryptoRate = cryptoRates.find((rate) => rate.id.toString() === wallet.id.toString());
          const name = cryptoRate ? cryptoRate.name : `Crypto ${wallet.id}`;
          const rate = cryptoRate ? cryptoRate.montant : 1; // Si pas de cours trouvé, on utilise 1 par défaut
    
          return {
            id: wallet.id, // ID du portefeuille
            name, // Nom réel ou fictif de la crypto
            quantity: parseFloat(wallet.quantity).toFixed(2), // Quantité dans le portefeuille
            amount: (parseFloat(wallet.quantity) * rate).toFixed(2), // Montant total basé sur le cours
          };
        });
    
        // Mettre à jour l'état avec les données transformées
        setCryptos(transformedData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données du portefeuille ou des cours :', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBalance = async () => {
      try {
        const balance = await getTotalBalance();
        setTotalBalance(parseFloat(balance).toFixed(2));
      } catch (error) {
        console.error("Erreur lors de la récupération du solde total :", error);
      }
    };

    fetchBalance();
    fetchCryptos();
  }, []);

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Solde principal */}
      <View style={[styles.walletBalanceContainer, themeStyles.walletBalanceContainer]}>
        <Text style={[styles.walletBalanceText, themeStyles.walletBalanceText]}>Total Balance</Text>
        {loading ? (
          <Text style={[styles.walletBalanceAmount, themeStyles.walletBalanceAmount]}>Chargement...</Text>
        ) : (
          <Text style={[styles.walletBalanceAmount, themeStyles.walletBalanceAmount]}>
            ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalBalance)}
          </Text>
        )}
      </View>

      {/* Tableau des cryptomonnaies */}
      <View style={[styles.tableContainer, themeStyles.tableContainer]}>
        <Text style={[styles.tableHeader, themeStyles.tableHeader]}>Mes cryptomonnaies</Text>
        {loading ? (
          <Text style={[styles.loadingText, themeStyles.loadingText]}>Chargement...</Text>
        ) : (
          <FlatList
            data={cryptos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.tableRow, themeStyles.tableRow]}>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.name}</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>{item.quantity} units</Text>
                <Text style={[styles.tableCell, themeStyles.tableCell]}>
                  ${parseFloat(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
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
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  walletBalanceText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
  },
  walletBalanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
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
    color: '#333',
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

  // Dark Theme Styles
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

  // Light Theme Styles
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
