import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Footer from '../components/Footer'; // Import Footer

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ceci est la page Profile</Text>
    {/* Footer will appear at the bottom of the screen */}
    <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
