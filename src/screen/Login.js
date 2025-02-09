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
    <ImageBackground
      source={require('../../assets/crypto_background.jpg')} // Image de fond avec un thème crypto
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Bienvenue</Text>
            <Text style={styles.subtitle}>
              Connectez-vous pour accéder aux derniers cours.
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Adresse e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handlelogin}>
              <Text style={styles.submitButtonText}>Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>
                Pas encore de compte ? Inscrivez-vous
              </Text>
            </TouchableOpacity>

        </View>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(221, 201, 201, 0.9)', // Fond semi-transparent
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a', // Bleu roi
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b', // Gris pour contraste
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f4ff', // Fond gris clair
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1e40af', // Bleu roi pour bordures
    fontSize: 16,
    color: '#1e3a8a',
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2563eb', // Bleu roi vif
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signUpText: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
