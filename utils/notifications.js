const { Expo } = require('expo-server-sdk');
const axios = require('axios');

const expo = new Expo();

async function sendPushNotification(expoPushToken, message) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Token ${expoPushToken} n'est pas valide`);
        return;
    }

    const messages = [
        {
            to: expoPushToken,
            sound: 'default',
            body: message.body || 'Notification par défaut',
            title: message.title || 'Titre par défaut',
            data: message.data || { withSome: 'data' },
        },
    ];

    try {
        // Envoi via le SDK local Expo
        let tickets = await expo.sendPushNotificationsAsync(messages);
        console.log('Notification envoyée avec succès via SDK Expo:', tickets);
    } catch (error) {
        console.error('Erreur d\'envoi de la notification via SDK Expo:', error);
    }

    try {
        // Envoi via l'API Expo
        const response = await axios.post('https://exp.host/--/api/v2/push/send', messages[0]);
        console.log('Notification envoyée avec succès via l\'API Expo:', response.data);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification via l\'API Expo:', error.response?.data || error.message);
    }
}

module.exports = { sendPushNotification };
