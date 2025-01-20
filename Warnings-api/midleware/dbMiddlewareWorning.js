const mongoose = require('mongoose');
const getDatabaseConnection = require('../../utils/database');
const worningSchema = require('../models/worning');
const logger = require('../../utils/logger');

// Middleware personnalisé pour la gestion des warnings
const dbMiddlewareWorning = async (req, res, next) => {
  try {
    logger.debug('Middleware: Début du traitement pour Wornings');

    // Récupération du DSP code
    const dsp_code = req.body.dsp_code || req.query.dsp_code || req.params.dsp_code;
    logger.debug(`Middleware: DSP Code reçu : ${dsp_code || 'Non spécifié'}`);

    if (!dsp_code) {
      logger.error('Middleware: dsp_code est requis.');
      return res.status(400).json({ message: 'dsp_code est requis.' });
    }

    // Obtenez la connexion à la base de données
    const connection = await getDatabaseConnection(dsp_code);

    // Ajout du modèle Worning, uniquement si non déjà présent
    if (!connection.models.Worning) {
      connection.model('Worning', worningSchema);
    }

    // Injectez la connexion dans la requête
    req.connection = connection;
    logger.debug('Middleware: Connexion MongoDB injectée dans req.connection.');

    next();
  } catch (error) {
    logger.error('Middleware: Erreur dans dbMiddlewareWorning :', error.message);
    res.status(500).json({ message: 'Erreur de connexion à la base de données.', error: error.message });
  }
};

module.exports = dbMiddlewareWorning;
