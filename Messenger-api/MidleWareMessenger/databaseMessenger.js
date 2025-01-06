const mongoose = require('mongoose');

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
  let retries = 3; // Nombre de tentatives en cas d'échec

  while (retries > 0) {
    try {
      // Après : Dynamisation de maxPoolSize
      const poolSize = process.env.NODE_ENV === 'production' ? 50 : 10; // Plus élevé en production
      const connection = mongoose.createConnection(uri, {
        maxPoolSize: poolSize,
        serverSelectionTimeoutMS: 30000, // Timeout réduit
      });


      // Gestion des événements de connexion
      connection.on('connected', () => {
      });

      connection.on('error', (err) => {
        console.error(`Erreur de connexion à la base de données (${dbName}) :`, err.message);
        delete connections[dbName]; // Supprimer la connexion du cache en cas d'erreur
      });

      connection.on('disconnected', () => {
        console.warn(`Déconnexion de la base de données (${dbName}).`);
      });

      // Désactiver les commandes en mémoire tampon pour éviter des comportements inattendus
      connection.set('bufferCommands', false);

      // Ajouter la connexion au cache
      connections[dbName] = connection;
      
      return connection;
    } catch (error) {
      console.error(`Erreur lors de la connexion à ${dbName} (${retries - 1} tentatives restantes) :`, error.message);
      retries -= 1;

      if (retries === 0) {
        throw new Error(`Impossible d'établir une connexion à ${dbName} après plusieurs tentatives : ${error.message}`);
      }
    }
  }
};

// Nettoyage des connexions en cas d'arrêt du serveur
process.on('SIGINT', async () => {
  console.log('Fermeture des connexions MongoDB...');
  const closePromises = Object.values(connections).map(async (conn) => {
    try {
      await conn.close();
      console.log(`Connexion fermée proprement pour la base : ${conn.name}`);
    } catch (err) {
      console.error(`Erreur lors de la fermeture de la connexion : ${conn.name}`, err.message);
    }
  });
  await Promise.all(closePromises);
  console.log('Toutes les connexions MongoDB ont été fermées.');
  process.exit(0);
});

module.exports = getDatabaseConnection;
