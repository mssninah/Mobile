import React from 'react';
import { logout } from '../services/authService';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      <Text style={[styles.message, themeStyles.message]}>Logged successfully</Text>

      {/* Log Out Button */}
      <TouchableOpacity style={[styles.button, themeStyles.button]} onPress={handleLogout}>
        <Text style={[styles.buttonText, themeStyles.buttonText]}>Log Out</Text>
      </TouchableOpacity>

      {/* Dark Mode toggle with icons */}
      <TouchableOpacity style={styles.modeToggle} onPress={toggleDarkMode}>
        <Icon
          name={darkMode ? 'sun' : 'moon'} // Sun icon for light mode, Moon icon for dark mode
          size={24}
          color={darkMode ? '#FFD700' : '#000'} // Yellow for sun (light mode), black for moon (dark mode)
        />
        <Text style={[themeStyles.message, styles.modeToggleText]}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
      </TouchableOpacity>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    message: {
      color: '#fff',
    },
    button: {
      backgroundColor: '#6200EE',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      paddingVertical: 12,
      paddingHorizontal: 30,
      fontWeight: 'bold',
    },
    modeToggleText: {
      color: '#fff',
      marginLeft: 10, // Adds space between icon and text
      fontSize: 18,
      fontWeight: '600',
    },
  },
  lightTheme: {
    container: {
      backgroundColor: '#fff',
    },
    message: {
      color: '#000',
    },
    button: {
      backgroundColor: '#6200EE',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      paddingVertical: 12,
      paddingHorizontal: 30,
      fontWeight: 'bold',
    },
    modeToggleText: {
      color: '#000',
      marginLeft: 10, // Adds space between icon and text
      fontSize: 18,
      fontWeight: '600',
    },
  },
  button: {
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
  },
  modeToggle: {
    flexDirection: 'row', // Makes the icon and text appear next to each other
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ImportFile;
