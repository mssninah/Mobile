import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { auth, firestore } from '../config/firebase-config'; // Import Firebase Firestore
import * as ImagePicker from 'expo-image-picker'; 
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';

const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      fetchProfileImage(user.email);
    }
  }, []);

  // Fetch image from Firebase Firestore
  const fetchProfileImage = async (email) => {
    try {
      const doc = await firestore.collection('users').doc(email).get();
      if (doc.exists) {
        setProfilePic(doc.data().profileImage);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  // Capture Image
  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    console.log('Camera result:', result);
  
    if (!result.canceled && result.assets && result.assets[0].uri) {
      try {
        console.log('Uploading image to Cloudinary...');
        const uploadedImageURL = await uploadImageToCloudinary(result.assets[0].uri);
        
        // Update Firebase Auth profile with the new image URL
        const user = auth.currentUser;
        if (user) {
          await user.updateProfile({ photoURL: uploadedImageURL });
          setProfilePic(uploadedImageURL); // Update local state
          Alert.alert('Success', 'Profile picture updated successfully!');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'There was an error uploading your image.');
      }
    } else {
      console.log('No image selected or operation cancelled.');
      Alert.alert('No Image', 'You did not select an image.');
    }
  };
  

  // Save Profile Image to Firestore
  const saveProfileImageToFirestore = async (email, imageUrl) => {
    try {
      await firestore.collection('users').doc(email).set({ profileImage: imageUrl }, { merge: true });
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {userEmail}</Text>
      <Image source={{ uri: profilePic }} style={styles.profileImage} />
      <Button title="Take Profile Picture" onPress={takePicture} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8', padding: 20 },
  text: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  profileImage: { width: 150, height: 150, borderRadius: 75, borderWidth: 4, borderColor: '#ddd', marginBottom: 20 },
});

export default ProfileScreen;
