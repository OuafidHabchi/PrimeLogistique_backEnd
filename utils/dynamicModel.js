const mongoose = require('mongoose');

/**
 * Récupère ou crée un modèle dynamique pour la base de données.
 * @param {mongoose.Connection} connection - La connexion MongoDB
 * @param {string} modelName - Le nom du modèle (ex. "Employees")
 * @param {mongoose.Schema} schema - Le schéma du modèle
 * @returns {mongoose.Model} - Le modèle dynamique
 */
const getDynamicModel = (connection, modelName, schema) => {
  console.log(`Demande de modèle : ${modelName}`);

  // Validation des paramètres
  if (!connection || connection.constructor.name !== 'NativeConnection') {
    throw new Error(`Connexion MongoDB invalide ou inexistante.`);
  }

  if (!modelName || typeof modelName !== 'string') {
    console.error(`Nom du modèle invalide : ${modelName}`);
    throw new Error(`Nom du modèle "${modelName}" est requis et doit être une chaîne valide.`);
  }

  if (!schema || !(schema instanceof mongoose.Schema)) {
    console.error(`Invalid schema for model: ${modelName}`);
    throw new Error(`Schéma invalide pour le modèle "${modelName}".`);
  }

  // Vérification de l'existence du modèle
  if (connection.models[modelName]) {
    return connection.models[modelName];
  }

  // Création du modèle
  try {
    const model = connection.model(modelName, schema);
    console.timeEnd(`Initialisation du modèle : ${modelName}`);
    console.log(`Modèle ${modelName} créé avec succès.`);
    return model;
  } catch (err) {
    console.error(`Erreur lors de la création du modèle "${modelName}" :`, err.message);
    throw new Error(`Échec de la création du modèle "${modelName}" : ${err.message}`);
  }
};

module.exports = getDynamicModel;
