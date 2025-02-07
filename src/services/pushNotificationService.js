import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Request permission for push notifications and get the token
export const registerForPushNotificationsAsync = async () => {
    let token;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // If permission is not granted, request permission
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Permission for push notifications was denied!');
            return;
        }

        // Get the Expo push token
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
    } else {
        alert('Must use a physical device for push notifications.');
    }

    return token;
};

// Function to send a push notification
export const sendPushNotification = async (expoPushToken, message) => {
    const messageBody = {
        to: expoPushToken,
        sound: 'default',
        title: 'Bienvenue !',
        body: message,
        data: { extraData: 'Some extra data' },
    };

    try {
        // Sending the notification to Expo's push notification service
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageBody),
        });

        const responseJson = await response.json();
        console.log('Push notification response:', responseJson);
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};
