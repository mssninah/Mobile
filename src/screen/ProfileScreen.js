import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Linking } from 'react-native';
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

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com').catch(err =>
      console.error('Erreur lors de l\'ouverture du lien YouTube :', err)
    );
  };

  const openFacebook = () => {
    Linking.openURL('https://www.facebook.com').catch(err =>
      console.error('Erreur lors de l\'ouverture du lien Facebook :', err)
    );
  };

  const openWhatsApp = () => {
    Linking.openURL('https://www.whatsapp.com').catch(err =>
      console.error('Erreur lors de l\'ouverture du lien WhatsApp :', err)
    );
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Mon Profil</Text>

      {loading ? (
        <ActivityIndicator size="large" color={themeStyles.spinnerColor} />
      ) : (
        <View style={styles.imageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../../assets/default-avatar.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Icon name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoBox}>
        <View style={styles.infoItem}>
          <Icon name="envelope" size={20} color="#1e40af" />
          <Text style={styles.infoText}>{email || 'Adresse email non disponible'}</Text>
        </View>
      </View>

      <Text style={styles.findUsText}>Find us:</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity onPress={openYouTube} style={styles.iconButton}>
          <Icon name="youtube" size={30} color="#ff0000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openFacebook} style={styles.iconButton}>
          <Icon name="facebook" size={30} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openWhatsApp} style={styles.iconButton}>
          <Icon name="whatsapp" size={30} color="#25d366" />
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    backgroundColor: '#f4f7fc',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    color: '#2F4F4F',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 5,
    borderColor: '#1e40af',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  uploadButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#1E40AF',
    borderRadius: 50,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  infoBox: {
    backgroundColor: '#f1f5f9',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    fontFamily: 'Roboto',
  },
  findUsText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  iconButton: {
    padding: 12,
  },
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    title: {
      color: '#fff',
    },
    email: {
      color: '#fff',
    },
    spinnerColor: '#1E40AF',
  },
  lightTheme: {
    container: {
      backgroundColor: '#f4f7fc',
    },
    title: {
      color: '#2F4F4F',
    },
    email: {
      color: '#333',
    },
    spinnerColor: '#1E40AF',
  },
});

export default ProfileScreen;
