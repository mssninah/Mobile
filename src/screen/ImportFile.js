import React from 'react';
import { logout } from '../services/authService';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/Feather'; // Import des icônes

const ImportFile = ({ navigation }) => {
  const { darkMode, toggleDarkMode } = useTheme(); // Accès au contexte
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    navigation.navigate('Login');
  };

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <Text style={[styles.header, themeStyles.header]}>Paramètres</Text>

     
      {/* Light/Dark Mode toggle with a checkbox */}
      <View style={[styles.toggleContainer, themeStyles.toggleContainer]}>
        <Text style={[styles.toggleText, themeStyles.toggleText]}>Mode Sombre</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#4B9CD3' }}
          thumbColor={darkMode ? '#fff' : '#f4f3f4'}
        />
      </View>

       {/* Log Out Button */}
       <TouchableOpacity style={[styles.button, themeStyles.button]} onPress={handleLogout}>
        <Text style={[styles.buttonText, themeStyles.buttonText]}>Déconnexion</Text>
      </TouchableOpacity>


      {/* Help Button */}
      <TouchableOpacity style={[styles.button, themeStyles.button]}>
        <Text style={[styles.buttonText, themeStyles.buttonText]}>Aide</Text>
      </TouchableOpacity>

      {/* Developer Signature */}
      <Text style={[styles.signature, themeStyles.signature]}>
        @Copyright(2025), All rights reserved
      </Text>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  signature: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },

  // Dark Theme Styles
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    header: {
      color: '#fff',
    },
    button: {
      backgroundColor: '#4B9CD3',
    },
    buttonText: {
      color: '#fff',
    },
    toggleContainer: {
      backgroundColor: '#333',
    },
    toggleText: {
      color: '#fff',
    },
    signature: {
      color: '#ddd',
    },
  },

  // Light Theme Styles
  lightTheme: {
    container: {
      backgroundColor: '#fff',
    },
    header: {
      color: '#000',
    },
    button: {
      backgroundColor: '#6200EE',
    },
    buttonText: {
      color: '#fff',
    },
    toggleContainer: {
      backgroundColor: '#e0f2fe',
    },
    toggleText: {
      color: '#000',
    },
    signature: {
      color: '#333',
    },
  },
});

export default ImportFile;
