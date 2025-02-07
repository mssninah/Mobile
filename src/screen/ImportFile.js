import React from 'react';
import { logout } from '../services/authService';
import { View, Text, Button, StyleSheet } from 'react-native';
import Footer from '../components/Footer'; // Import Footer
const ImportFile = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        }
        // Add your logout logic here
        navigation.navigate('Login'); // Assuming you have a Login screen to navigate to
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Logged successfully</Text>
            
            <Button title="Log Out" onPress={handleLogout} />
            <Footer />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    message: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default ImportFile;