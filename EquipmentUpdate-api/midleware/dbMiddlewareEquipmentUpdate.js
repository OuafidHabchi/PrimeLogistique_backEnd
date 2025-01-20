const mongoose = require('mongoose');
const getDatabaseConnection = require('../../utils/database'); // Importez votre module global
const logger = require('../../utils/logger');

// Définition des modèles pour EquipmentUpdate
const equipmentUpdateSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  vanName: { type: String, required: true },
  localTime: { type: String, required: true },
  imagePath: { type: String, required: true },
  userId: { type: String, required: true }, 
  photoType: { type: String, required: true }, 
  day: { type: String, required: true },
});

// Middleware pour l'API EquipmentUpdate
const dbMiddlewareEquipmentUpdate = async (req, res, next) => {
  try {
    logger.debug('Middleware: Début du traitement pour EquipmentUpdate');

    // Récupération du DSP code
    const dsp_code = req.body.dsp_code || req.query.dsp_code || req.params.dsp_code;
    logger.debug(`Middleware: DSP Code reçu : ${dsp_code || 'Non spécifié'}`);

    if (!dsp_code) {
      logger.error('Middleware: dsp_code est requis.');
      return res.status(400).json({ message: 'dsp_code est requis.' });
    }

    // Obtenez la connexion à la base de données
    const connection = await getDatabaseConnection(dsp_code);

    // Ajout du modèle EquipmentUpdate, uniquement si non déjà présent
    if (!connection.models.EquipmentUpdate) {
      connection.model('EquipmentUpdate', equipmentUpdateSchema);
    }

    // Injectez la connexion dans la requête
    req.connection = connection;
    logger.debug('Middleware: Connexion MongoDB injectée dans req.connection.');

    next();
  } catch (error) {
    logger.error('Middleware: Erreur dans dbMiddlewareEquipmentUpdate :', error.message);
    res.status(500).json({ message: 'Erreur de connexion à la base de données.', error: error.message });
  }
};

module.exports = dbMiddlewareEquipmentUpdate;
