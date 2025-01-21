const axios = require('axios');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(expoPushToken, message) {
    // Vérifier si le token est valide
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Token ${expoPushToken} n'est pas valide`);
        return;
    }

    // Créer le message à envoyer
    const payload = {
        to: expoPushToken, // Token Expo
        sound: 'default',
        title: message.title || 'Notification', // Titre par défaut
        body: message.body || 'Vous avez reçu une notification.', // Message par défaut
        data: message.data || {}, // Données supplémentaires
    };

    try {
        // Envoyer la notification via l'API Expo
        const response = await axios.post('https://exp.host/--/api/v2/push/send', payload);
        console.log('Notification envoyée avec succès:', response.data);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification :', error.response?.data || error.message);
    }
}

module.exports = { sendPushNotification };
