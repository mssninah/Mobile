import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Footer from '../components/Footer'; // Import Footer

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ceci est la page Portefeuille</Text>
    {/* Footer will appear at the bottom of the screen */}
    <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
