import { login, signInWithGoogle } from '../services/authService';
import Button from '../components/Button';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, StatusBar } from 'react-native';

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
  
      await login(trimmedEmail, trimmedPassword);  // Login and send notification
      navigation.navigate('CryptoCourses'); // Navigate to MainTabs which contains CryptoCourses
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
  
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigation.navigate('CryptoCourses'); // Navigate to MainTabs which contains CryptoCourses
    } catch (error) {
      console.error(error.message);
      alert('An error occurred with Google Sign-In. Please try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handlelogin}>
        <Text style={styles.submitButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or Log With:</Text>

      <View style={styles.socialButtonsContainer}>
        <Button
          color={'#4285F4'}
          text="Google"
          logo={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_2013_Google.png/600px-Logo_2013_Google.png' }}
          style={styles.socialButton}
          onPress={handleGoogleLogin}
        />
        <Button
          color={'#333'}
          text="GitHub"
          logo={{ uri: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' }}
          style={styles.socialButton}
        />
        <Button
          color={'#3b5998'}
          text="Facebook"
          logo={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' }}
          style={styles.socialButton}
        />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 20,
  },
  orText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});
