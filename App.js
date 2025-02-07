

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/services/pushNotificationService';

// Import screens
import LoginScreen from './src/screen/Login';
import SignUpScreen from './src/screen/SignUp';
import CryptoCoursesScreen from './src/screen/CryptoCoursesScreen';
import WalletScreen from './src/screen/WalletScreen'; // Import Wallet Screen
import ProfileScreen from './src/screen/ProfileScreen'; // Import Profile Screen
import ImportFile from './src/screen/ImportFile'; // Import ImportFile Screen

// Create Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State for login status

  useEffect(() => {
    // Push notification setup
    const getPushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification opened:', response);
    });

    getPushToken();

    // Clean up listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // Handle login success
  const handleLogin = () => {
    setIsLoggedIn(true);  // Set the login state to true
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "CryptoCourses" : "Login"}>
        {/* Login Screen */}
        <Stack.Screen 
          name="Login" 
          component={(props) => <LoginScreen {...props} onLogin={handleLogin} />} 
        />


        {/* SignUp Screen */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* CryptoCourses Screen */}
        <Stack.Screen name="CryptoCourses" component={CryptoCoursesScreen} />

        {/* Wallet Screen */}
        <Stack.Screen name="Wallet" component={WalletScreen} />

        {/* Profile Screen */}
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* ImportFile Screen */}
        <Stack.Screen name="ImportFile" component={ImportFile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
