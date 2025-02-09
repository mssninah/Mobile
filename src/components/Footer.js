import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconContainer}>
                <Icon name="user" size={30} color="#fff" style={styles.icon} />
                <Text style={styles.iconText}>Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CryptoCourses')} style={styles.iconContainer}>
                <Icon name="bitcoin" size={30} color="#fff" style={styles.icon} />
                <Text style={styles.iconText}>Crypto</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} style={styles.iconContainer}>
                <Icon name="money" size={30} color="#fff" style={styles.icon} />
                <Text style={styles.iconText}>Portefeuille</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')} style={styles.iconContainer}>
                <Icon name="history" size={30} color="#fff" style={styles.icon} />
                <Text style={styles.iconText}>Historique</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ImportFile')} style={styles.iconContainer}>
                <Icon name="cog" size={30} color="#fff" style={styles.icon} />
                <Text style={styles.iconText}>Paramètres</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1e40af', // Bleu roi
        paddingVertical: 12,
        position: 'absolute',
        bottom: 0,
        width: '100%', // S'assure que le footer couvre toute la largeur
        left: 0,
        right: 0,  // Garantit que le footer est bien aligné à gauche et à droite
        borderTopLeftRadius: 20, // Arrondi du coin supérieur gauche
        borderTopRightRadius: 20, // Arrondi du coin supérieur droit
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10, // Pour l'ombre sur Android
    },
    iconContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    icon: {
        marginBottom: 4, // Marge sous l'icône
    },
    iconText: {
        color: '#fff', // Texte en blanc
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600', // Pour un texte plus lisible
    },
});

export default Footer;