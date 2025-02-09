global.SharedArrayBuffer = global.SharedArrayBuffer || undefined;
global.DebuggerInternal = global.DebuggerInternal || undefined;
global.setTimeout = global.setTimeout || undefined;
global.nativeFabricUIManager = global.nativeFabricUIManager || undefined;
global.clearTimeout = global.clearTimeout || undefined;
global.RN$enableMicrotasksInReact = global.RN$enableMicrotasksInReact || undefined;
global.queueMicrotask = global.queueMicrotask || undefined;
global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = global.__REACT_DEVTOOLS_GLOBAL_HOOK__ || undefined;
global.setImmediate = global.setImmediate || undefined;
global.fetch = global.fetch || undefined;
global.Headers = global.Headers || undefined;
global.Request = global.Request || undefined;
global.Response = global.Response || undefined;
global.FileReader = global.FileReader || undefined;
global.URLSearchParams = global.URLSearchParams || undefined;
global.AbortController = global.AbortController || undefined;
global.XMLHttpRequest = global.XMLHttpRequest || undefined;
global.self = global.self || undefined;
global.navigator = global.navigator || undefined;
global.MessageChannel = global.MessageChannel || undefined;
global.nativeRuntimeScheduler = global.nativeRuntimeScheduler || undefined;
global.requestAnimationFrame = global.requestAnimationFrame || undefined;
global.REACT_NAVIGATION_DEVTOOLS = global.REACT_NAVIGATION_DEVTOOLS || undefined;
global.ResizeObserver = global.ResizeObserver || undefined;
global._WORKLET = global._WORKLET || undefined;
global.location = global.location || undefined;
global.__reanimatedLoggerConfig = global.__reanimatedLoggerConfig || undefined;
global.structuredClone = global.structuredClone || undefined;
global.document = global.document || undefined;
global.HTMLElement = global.HTMLElement || undefined;
global.MutationObserver = global.MutationObserver || undefined;
global.getComputedStyle = global.getComputedStyle || undefined;
global.jest = global.jest || undefined;
global._getAnimationTimestamp = global._getAnimationTimestamp || undefined;
global.Atomics = global.Atomics || undefined;
global.FinalizationRegistry = global.FinalizationRegistry || undefined;
global.WeakRef = global.WeakRef || undefined;
global.IDBDatabase = global.IDBDatabase || undefined;
global.IDBIndex = global.IDBIndex || undefined;
global.IDBObjectStore = global.IDBObjectStore || undefined;
global.IDBCursor = global.IDBCursor || undefined;
global.IDBTransaction = global.IDBTransaction || undefined;
global.DOMException = global.DOMException || undefined;
global.IDBRequest = global.IDBRequest || undefined;

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
