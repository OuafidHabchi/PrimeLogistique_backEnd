const mongoose = require('mongoose');
const getDatabaseConnection = require('./database');
const getDynamicModel = require('./dynamicModel');
const modelsMap = require('./modelsMap');
const logger = require('./logger');

const dbMiddleware = async (req, res, next) => {
  const dsp_code = req.body.dsp_code || req.query.dsp_code || req.params.dsp_code;
  logger.debug(`DSP Code reçu : ${dsp_code || 'Non spécifié'}`);

  if (!dsp_code) {
    logger.error('Erreur : dsp_code est requis.');
    return res.status(400).json({ message: 'dsp_code est requis.' });
  }

  try {
    let connection;

    // Étape 1 : Connexion à MongoDB
    try {
      connection = await getDatabaseConnection(dsp_code);
      if (!connection) {
        throw new Error('Connexion MongoDB introuvable.');
      }
      logger.debug(`Connexion établie pour la base : ${dsp_code}`);
    } catch (dbError) {
      logger.error(`Erreur lors de la connexion à MongoDB : ${dbError.message}`);
      return res.status(500).json({ message: 'Erreur de connexion à MongoDB.', error: dbError.message });
    }

    // Étape 2 : Vérification de req.requiredModels
    if (!req.requiredModels) {
      logger.warn('req.requiredModels non défini, aucun modèle ne sera chargé.');
      req.requiredModels = [];
    }
    logger.debug(`Modèles demandés (req.requiredModels) : ${req.requiredModels.join(', ') || 'Aucun modèle'}`);

    // Étape 3 : Initialisation des modèles nécessaires
    try {
      const requiredModels = req.requiredModels;

      requiredModels.forEach((modelName) => {
        logger.debug(`Tentative d'initialisation du modèle : ${modelName}`);

        // Vérifiez si le modèle existe dans modelsMap
        const schema = modelsMap[modelName];
        if (!schema) {
          logger.error(`Modèle "${modelName}" introuvable dans modelsMap.`);
          throw new Error(`Modèle "${modelName}" introuvable dans modelsMap.`);
        }

        // Vérifiez si le modèle est déjà dans connection.models
        if (!connection.models[modelName]) {
          logger.debug(`Modèle "${modelName}" non trouvé dans connection.models. Création en cours...`);
          getDynamicModel(connection, modelName, schema);
          logger.debug(`Modèle "${modelName}" initialisé avec succès.`);
        } else {
          logger.debug(`Modèle "${modelName}" déjà existant dans connection.models.`);
        }
      });

      logger.debug(`Modèles nécessaires initialisés : ${requiredModels.join(', ') || 'Aucun modèle initialisé'}`);
    } catch (initError) {
      logger.error(`Erreur lors de l'initialisation des modèles nécessaires : ${initError.message}`);
      return res.status(500).json({ message: 'Erreur d\'initialisation des modèles.', error: initError.message });
    }

    // Étape 4 : Injection de la connexion dans req
    req.connection = connection;
    logger.debug(`req.connection.models après injection : ${Object.keys(req.connection.models || {}).join(', ') || 'Aucun modèle disponible'}`);
    
    next(); // Passer au middleware suivant
  } catch (error) {
    logger.error(`Erreur dans dbMiddleware : ${error.message}`);
    res.status(500).json({
      message: 'Erreur interne dans dbMiddleware.',
      error: error.message,
    });
  }
};

module.exports = dbMiddleware;
