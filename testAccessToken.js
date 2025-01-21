const axios = require('axios');

async function sendExpoPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken, // Token d'Expo
        sound: 'default',
        title: 'Test Notification',
        body: 'This is a test message sent via Expo Notifications',
        data: { someData: 'goes here' },
    };

    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/send', message);
        console.log('Notification envoyée avec succès:', response.data);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification :', error.response?.data || error.message);
    }
}

// Exemple d'appel avec un token Expo valide
const expoPushToken = 'ExponentPushToken[Gu20oAI2dJg6Mp78Ttkpmr]'; // Remplacez par un vrai token Expo
sendExpoPushNotification(expoPushToken);