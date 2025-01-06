const mongoose = require('mongoose');

// Importation des modèles

const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');


// Mapping des modèles
const modelsMap = {
  Conversation,
  Message,
};

/**
 * Vérifie que tous les modèles dans `modelsMap` sont valides
 */
const validateModelsMap = () => {
  for (const [modelName, model] of Object.entries(modelsMap)) {
    if (!model || !(model instanceof mongoose.Schema || typeof model.schema === 'object')) {
      console.error(`Erreur : Le modèle "${modelName}" est invalide ou manquant.`);
      throw new Error(`Modèle "${modelName}" invalide ou mal configuré.`);
    }
  }
  console.log('Tous les modèles ont été validés avec succès.');
};

// Valide les modèles au moment du chargement
try {
  validateModelsMap();
} catch (error) {
  console.error('Erreur lors de la validation des modèles :', error.message);
  process.exit(1); // Arrête l'application si les modèles sont invalides
}

module.exports = modelsMap;
