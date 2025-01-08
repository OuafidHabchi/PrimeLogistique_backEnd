const mongoose = require('mongoose');
const logger = require('./logger');

// Cache des connexions existantes
const connections = {};

/**
 * Établit ou réutilise une connexion MongoDB dynamique
 * @param {string} dsp_code - Code DSP pour mapper à la base de données
 * @returns {mongoose.Connection} - Connexion MongoDB
 */
const getDatabaseConnection = async (dsp_code) => {
  const databaseMap = {
    vtrl1: 'VTRL',
    vtrl2: 'TEST_2',
    afml2: 'AFML',
    atsl3: 'ATSL',
    casa4: 'CASA',
    r961r: 'R961',
    cnkt5: 'CNkT',
    msnt6: 'MSNT',
    flxp7: 'FLXP',
    estv8: 'ESTV',
  };

  // Vérification du DSP code
  const dbName = databaseMap[dsp_code];
  if (!dbName) {
    throw new Error(`DSP code "${dsp_code}" introuvable dans le mapping.`);
  }

  // Réutiliser une connexion existante si elle est prête
  if (connections[dbName] && connections[dbName].readyState === 1) {
    return connections[dbName];
  }

  // Initialiser une nouvelle connexion si nécessaire
  const uri = `mongodb+srv://wafid:wafid@ouafid.aihn5iq.mongodb.net/${dbName}`;
  const poolSize = process.env.NODE_ENV === 'production' ? 50 : 10; // Taille du pool

  try {
    const connection = mongoose.createConnection(uri, {
      maxPoolSize: poolSize,
      serverSelectionTimeoutMS: 30000, // Timeout de sélection
    });

    // Timeout pour les connexions inactives
    connection.on('connected', () => {
      logger.debug(`Connexion établie à la base : ${dbName}`);
    });

    connection.on('disconnected', () => {
      logger.warn(`Déconnexion automatique de la base : ${dbName}`);
    });

    connection.on('error', (err) => {
      logger.error(`Erreur de connexion (${dbName}) :`, err.message);
      delete connections[dbName];
    });

    // Nettoyage automatique après 10 minutes d'inactivité
    setTimeout(() => {
      if (connection.readyState === 1) {
        connection.close().then(() => {
          logger.debug(`Connexion fermée pour inactivité (${dbName}).`);
        });
        delete connections[dbName];
      }
    }, 10 * 60 * 1000); // 10 minutes

    // Désactiver les commandes en mémoire tampon
    connection.set('bufferCommands', false);

    // Ajouter au cache
    connections[dbName] = connection;

    return connection;
  } catch (error) {
    logger.error(`Erreur lors de la connexion à ${dbName} :`, error.message);
    throw new Error(`Connexion à ${dbName} échouée : ${error.message}`);
  }
};

// Nettoyage des connexions à la fin
process.on('SIGINT', async () => {
  logger.debug('Fermeture des connexions MongoDB...');
  const closePromises = Object.values(connections).map(async (conn) => {
    try {
      await conn.close();
      logger.debug(`Connexion fermée proprement pour la base : ${conn.name}`);
    } catch (err) {
      logger.error(`Erreur lors de la fermeture de la connexion : ${conn.name}`, err.message);
    }
  });
  await Promise.all(closePromises);
  logger.debug('Toutes les connexions MongoDB ont été fermées.');
  process.exit(0);
});

module.exports = getDatabaseConnection;
