const mongoose = require('mongoose');
const logger = require('./logger');

/**
 * Récupère ou crée un modèle dynamique pour la base de données.
 * @param {mongoose.Connection} connection - La connexion MongoDB
 * @param {string} modelName - Le nom du modèle (ex. "Employee")
 * @param {mongoose.Schema} schema - Le schéma du modèle
 * @returns {mongoose.Model} - Le modèle dynamique
 */
const getDynamicModel = (connection, modelName, schema) => {
  logger.debug(`Demande de modèle : ${modelName}`);

  // Validation des paramètres
  if (!connection || connection.constructor.name !== 'NativeConnection') {
    logger.error('Connexion MongoDB invalide ou inexistante.');
    throw new Error('Connexion MongoDB invalide ou inexistante.');
  }

  if (!modelName || typeof modelName !== 'string') {
    logger.error(`Nom du modèle invalide : ${modelName}`);
    throw new Error(`Nom du modèle "${modelName}" est requis et doit être une chaîne valide.`);
  }

  if (!schema || !(schema instanceof mongoose.Schema)) {
    logger.error(`Schéma invalide pour le modèle "${modelName}".`);
    throw new Error(`Schéma invalide pour le modèle "${modelName}".`);
  }

  // Vérification de l'existence du modèle
  if (connection.models[modelName]) {
    logger.debug(`Modèle "${modelName}" déjà existant.`);
    return connection.models[modelName];
  }

  // Création du modèle
  try {
    const model = connection.model(modelName, schema);
    logger.info(`Modèle "${modelName}" créé avec succès.`);
    return model;
  } catch (err) {
    logger.error(`Erreur lors de la création du modèle "${modelName}" : ${err.message}`);
    throw new Error(`Échec de la création du modèle "${modelName}" : ${err.message}`);
  }
};

module.exports = getDynamicModel;
