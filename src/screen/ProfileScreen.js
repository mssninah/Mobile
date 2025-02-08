import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from '../config/firebase-config';
import { pickImageAndUpload, getProfilePictureUrl } from '../utils/uploadImageToCloudinary';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importation de l'icône
import { useTheme } from '../../contexts/ThemeContext'; // Import du contexte de thème

const ProfileScreen = () => {
  const { darkMode } = useTheme(); // Accède au mode sombre ou clair
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      setLoading(true);
      const imageUrl = await getProfilePictureUrl();
      if (imageUrl) setProfileImage(imageUrl);
      setLoading(false);
    };

    fetchProfileImage();
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    const uploadedImageUrl = await pickImageAndUpload();
    if (uploadedImageUrl) setProfileImage(uploadedImageUrl);
    setLoading(false);
  };

  const themeStyles = darkMode ? styles.darkTheme : styles.lightTheme; // Applique les styles du mode sombre ou clair

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>Profile</Text>
      
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
        <Text style={[styles.uploadText, themeStyles.uploadText]}> Upload Profile Picture</Text>
      </TouchableOpacity>

      <Text style={[styles.email, themeStyles.email]}>{auth.currentUser?.email}</Text>
      <Footer/>
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
    shadowColor: "#000",  // Ombre du fond pour donner de la profondeur
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  // Common Styles
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
    borderColor: '#00ffcc', // Couleur de bordure inspirée de la cryptomonnaie
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  uploadButton: {
    backgroundColor: '#007bff',  // Bleu cryptomonnaie
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
    color: '#fff',
    fontWeight: '600',
  },

  // Dark Theme Styles
  darkTheme: {
    container: {
      backgroundColor: '#121212',
    },
    title: {
      color: '#fff',
    },
    uploadButton: {
      backgroundColor: '#007bff', // Bleu plus profond
    },
    uploadText: {
      color: '#fff',
    },
    email: {
      color: '#fff',
    },
    spinnerColor: '#00ffcc', // Couleur du spinner en mode sombre
  },

  // Light Theme Styles
  lightTheme: {
    container: {
      backgroundColor: '#f4f7fc',
    },
    title: {
      color: '#2F4F4F', // Dark Slate Gray
    },
    uploadButton: {
      backgroundColor: '#4CAF50', // Vert lumineux
    },
    uploadText: {
      color: '#fff',
    },
    email: {
      color: '#333',
    },
    spinnerColor: '#007bff', // Bleu pour le spinner en mode clair
  },
});

export default ProfileScreen;
