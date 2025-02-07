import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Footer from '../components/Footer'; // Import Footer

const CryptoCoursesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to CryptoCourses</Text>

      {/* Footer will appear at the bottom of the screen */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CryptoCoursesScreen;
