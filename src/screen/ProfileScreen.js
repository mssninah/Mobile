import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from '../config/firebase-config';
import { pickImageAndUpload, getProfilePictureUrl } from '../utils/uploadImageToCloudinary';
import Footer from '../components/Footer';

const ProfileScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Image 
          source={profileImage ? { uri: profileImage } : require('../../assets/default-avatar.png')} 
          style={styles.profileImage} 
        />
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadText}>Upload Profile Picture</Text>
      </TouchableOpacity>

      <Text style={styles.email}>{auth.currentUser?.email}</Text>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadText: {
    color: '#fff',
    fontSize: 16,
  },
  email: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
