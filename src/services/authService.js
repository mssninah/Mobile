import { auth } from '../config/firebase-config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { registerForPushNotificationsAsync, sendPushNotification } from './pushNotificationService';

// Sign-in function
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the device's push notification token
        const expoPushToken = await registerForPushNotificationsAsync();

        // Send a notification to the user
        if (expoPushToken) {
            await sendPushNotification(expoPushToken, `@${email}, content de vous voir !`);
        }

        return user;
    } catch (error) {
        throw error;
    }
};

// Logout function
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
};
