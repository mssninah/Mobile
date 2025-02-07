# Mobile
Projet s5-final
# 📱 Crypto Wallet App

## 🚀 Description
Une application mobile développée avec **React Native** et **Expo**, permettant aux utilisateurs de :
- S'inscrire et se connecter via **Google Authentication**.
- Télécharger et gérer leur photo de profil avec **Cloudinary**.
- Consulter les cours de cryptomonnaies en temps réel.
- Gérer leur portefeuille crypto.

## 🛠 Technologies utilisées
- **React Native** avec **Expo** 📱
- **Firebase Authentication** 🔐
- **Cloudinary** pour le stockage d'images ☁️
- **React Navigation** pour la navigation 📌

## 📥 Installation
1. **Cloner le projet** :
   ```sh
   git clone https://github.com/mssninah/Mobile.git
   cd crypto-wallet-app
   ```
2. **Installer les dépendances** :
   ```sh
   npm install
   ```
3. **Configurer Firebase** :
   - Créer un projet Firebase.
   - Activer **Google Authentication**.
   - Ajouter `google-services.json` (Android) et `GoogleService-Info.plist` (iOS) dans les dossiers correspondants.

4. **Configurer Cloudinary** :
   - Créer un compte sur **[Cloudinary](https://cloudinary.com/)**.
   - Récupérer le **Cloud Name** et le **Upload Preset** dans le tableau de bord.
   - Ajouter ces informations dans un fichier `.env` :
     ```env
     CLOUDINARY_CLOUD_NAME=ton_cloud_name
     CLOUDINARY_UPLOAD_PRESET=ton_upload_preset
     ```

## ▶️ Exécution de l'application
Lancer l'application avec Expo :
```sh
npm start
```

## 📌 Fonctionnalités principales
- 📌 **Authentification Google** : Connexion et inscription sécurisées.
- 📸 **Upload d'image avec Cloudinary** : Prendre une photo et l'envoyer à Cloudinary.
- 💰 **Consultation des cours de crypto** : Accès aux prix en temps réel.
- 🏦 **Gestion du portefeuille** : Voir ses avoirs et transactions crypto.

## 📷 Upload d'image avec Cloudinary
L'upload d'image est géré dans `ProfileScreen.js` avec la fonction `uploadImageToCloudinary`.

Exemple d'utilisation dans `ProfileScreen.js` :
```js
const takePicture = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    const uploadedImageURL = await uploadImageToCloudinary(result.assets[0].uri);
    setProfilePic(uploadedImageURL);
  }
};
```

## 📚 Dossiers principaux
```
crypto-wallet-app/
│-- src/
│   │-- screen/
│   │   │-- Login.js
│   │   │-- SignUp.js
│   │   │-- CryptoCoursesScreen.js
│   │   │-- WalletScreen.js
│   │   │-- ProfileScreen.js
│   │-- services/
│   │   │-- pushNotificationService.js
│   │-- utils/
│   │   │-- uploadImageToCloudinary.js
```

## 📜 Licence
Projet open-source sous licence **MIT**.

---
🎉 **Développé avec ❤️ par Razafitsialonina**

