import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { auth, firestore } from '../config/firebase-config';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';

const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null); // Initialize to null

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
      fetchProfileImage(user.email);
    }
  }, []);

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

  const takePicture = async () => {
    // No permissions request needed with expo-image-picker, it handles it internally
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) { // Check if assets exists and has at least one item
      try {
        const uploadedImageURL = await uploadImageToCloudinary(result.assets[0].uri);

        const user = auth.currentUser;
        if (user) {
          await user.updateProfile({ photoURL: uploadedImageURL });
          setProfilePic(uploadedImageURL);

          // Also update Firestore (optional, but good for data consistency)
          await firestore.collection('users').doc(user.email).set({ profileImage: uploadedImageURL }, { merge: true });

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


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {userEmail}</Text>
      {/* Conditionally render the image */}
      {profilePic ? (
        <Image source={{ uri: profilePic }} style={styles.profileImage} />
      ) : (
        <View style={styles.profileImagePlaceholder} /> // Placeholder if no image
      )}

      <Button title="Take Profile Picture" onPress={takePicture} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8', padding: 20 },
  text: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  profileImage: { width: 150, height: 150, borderRadius: 75, borderWidth: 4, borderColor: '#ddd', marginBottom: 20 },
  profileImagePlaceholder: { // Style for the placeholder
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee', // Light gray background
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;