import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Footer = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconContainer}>
                <Icon name="user" size={24} color="#fff" />
                <Text style={styles.iconText}>Profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('CryptoCourses')} style={styles.iconContainer}>
                <Icon name="bitcoin" size={24} color="#fff" />
                <Text style={styles.iconText}>Crypto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={styles.iconContainer}>
                <Icon name="wallet" size={24} color="#fff" />
                <Text style={styles.iconText}>Portefeuille</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('ImportFile')} style={styles.iconContainer}>
                <Icon name="cog" size={24} color="#fff" />
                <Text style={styles.iconText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1E3A8A', // Bleu foncé
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default Footer;
