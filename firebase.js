const { JWT } = require('google-auth-library'); // Remplace 'google.auth.JWT' par 'JWT'
const fs = require('fs');
const path = require('path');

// Chemin absolu vers le fichier JSON du compte de service
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, './config/service-account.json');

// Scope requis pour Firebase Cloud Messaging
const SCOPES = ['https://www.googleapis.com/auth/firebase.messaging'];

/**
 * Fonction pour obtenir un token OAuth 2.0 pour FCM
 */
async function getAccessToken() {
  try {
    // Charger le fichier JSON du compte de service
    const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));

    // Afficher les données pour vérifier qu'elles sont correctement chargées
    console.log('Service Account Loaded:', {
      client_email: serviceAccount.client_email,
      private_key_exists: !!serviceAccount.private_key,
    });

    // Initialiser le client JWT pour générer le token OAuth 2.0
    const jwtClient = new JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      SCOPES
    );

    // Obtenir et retourner le token OAuth 2.0
    const tokens = await jwtClient.authorize();
    console.log('OAuth Tokens:', tokens);
    return tokens.access_token;
  } catch (error) {
    console.error('Erreur lors de la génération du token OAuth :', error);
    throw error;
  }
}

module.exports = { getAccessToken };
