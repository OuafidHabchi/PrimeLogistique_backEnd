// utils/notifications.js
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendPushNotification(expoPushToken, message) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Token ${expoPushToken} n'est pas valide`);
        return;
    }

    const messages = [{
        to: expoPushToken,
        sound: 'default',
        body: message,
        data: { withSome: 'data' },
    }];

    try {
        let tickets = await expo.sendPushNotificationsAsync(messages);
        console.log('Notification envoyée avec succès:', tickets);
    } catch (error) {
        console.error('Erreur d\'envoi de la notification:', error);
    }
}

module.exports = { sendPushNotification };
