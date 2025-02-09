import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pickImageAndUpload, getProfilePictureUrl } from '../utils/uploadImageToCloudinary';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileScreen = () => {
  const { darkMode } = useTheme();
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const authData = await AsyncStorage.getItem('auth_connected');
        if (authData) {
          const parsedData = JSON.parse(authData);
          setEmail(parsedData.mail);
          const imageUrl = parsedData.img || (await getProfilePictureUrl());
          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const uploadedImageUrl = await pickImageAndUpload();
      if (uploadedImageUrl) setProfileImage(uploadedImageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image :', error);
    } finally {
      setLoading(false);
    }
  };

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Mon Profil</Text>

      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.spinnerColor} />
      ) : (
        <Image
          source={profileImage ? { uri: profileImage } : require('../../assets/default-avatar.png')}
          style={styles.profileImage}
        />
      )}

      <TouchableOpacity style={[styles.uploadButton, themeStyles.uploadButton]} onPress={handleUpload}>
        <Icon name="pencil" size={20} color="#fff" />
        <Text style={[styles.uploadText, themeStyles.uploadText]}>Changer la photo de profil</Text>
      </TouchableOpacity>

      <Text style={[styles.email, themeStyles.email]}>{email || 'Adresse email non disponible'}</Text>
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
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#00ffcc',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
  email: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    title: {
      color: '#fff',
    },
    uploadButton: {
      backgroundColor: '#007bff',
    },
    uploadText: {
      color: '#fff',
    },
    email: {
      color: '#fff',
    },
    spinnerColor: '#00ffcc',
  },
  lightTheme: {
    container: {
      backgroundColor: '#f4f7fc',
    },
    title: {
      color: '#2F4F4F',
    },
    uploadButton: {
      backgroundColor: '#4CAF50',
    },
    uploadText: {
      color: '#fff',
    },
    email: {
      color: '#333',
    },
    spinnerColor: '#007bff',
  },
});

export default ProfileScreen;
