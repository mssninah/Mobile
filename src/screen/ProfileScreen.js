import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker'; // Import from react-native-image-picker
import { pickImageAndUpload, getProfilePictureUrl } from '../services/ProfileService'; // Import du service
import Footer from '../components/Footer';

export default function ProfileScreen() {
  const [imageUri, setImageUri] = useState(null);

  // Récupère l'URL de la photo de profil au chargement de l'écran
  useEffect(() => {
    const fetchProfilePicture = async () => {
      const url = await getProfilePictureUrl();
      if (url) {
        setImageUri(url); // Si une photo existe, on l'affiche
      }
    };
    fetchProfilePicture();
  }, []);

  // Gère l'upload de l'image
  const handlePickImage = async () => {
    try {
      launchCamera(
        {
          mediaType: 'photo', // Type de média : photo
          cameraType: 'back', // Type de caméra (avant ou arrière)
          quality: 0.5, // Qualité de l'image
        },
        (response) => {
          if (response.didCancel) {
            console.log('L\'utilisateur a annulé la prise de photo');
          } else if (response.errorCode) {
            console.error('Erreur lors de la prise de photo: ', response.errorMessage);
            Alert.alert('Erreur', 'Une erreur est survenue');
          } else {
            const imageUrl = response.assets[0].uri;
            if (imageUrl) {
              setImageUri(imageUrl); // Met à jour l'URL de l'image après la prise
              // Vous pouvez ici appeler une fonction pour uploader l'image si nécessaire
            }
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de la prise de photo', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    }
  };


  const ha
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page de Profil</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text>Aucune photo de profil</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Prendre une photo de profil</Text>
      </TouchableOpacity>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});
