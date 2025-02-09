import { login } from '../services/authService';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlelogin = async () => {
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        alert('Email and password cannot be empty.');
        return;
      }

      await login(trimmedEmail, trimmedPassword);
      navigation.navigate('CryptoCourses');
    } catch (error) {
      console.error(error.message);
      if (error.code === 'auth/invalid-email') {
        alert('Invalid email format. Please enter a valid email.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Wrong password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        alert('No user found with this email. Please register.');
      } else if (error.code === 'auth/invalid-credential') {
        alert('Invalid credentials. Please check your email and password.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>
          Connectez-vous pour accéder aux derniers cours.
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#1e40af" style={styles.icon} />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Adresse e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#1e40af" style={styles.icon} />
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handlelogin}>
          <Text style={styles.submitButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f2fe', // Un bleu pâle pour le fond général
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff', // Blanc pour la carte
    borderRadius: 25,
    padding: 30,
    shadowColor: '#1e40af', // Ombre bleu roi
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#1e40af', // Bordure bleu roi
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e40af', // Bleu roi
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#1e3a8a', // Bleu plus profond
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9', // Fond clair pour les champs de saisie
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#1e40af', // Bordure bleu roi
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1e40af', // Texte en bleu roi
  },
  submitButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#1e40af', // Bleu roi vif
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
