const mongoose = require('mongoose');
const getDatabaseConnection = require('../../utils/database'); // Importez votre module global
const logger = require('../../utils/logger');

// Définition des modèles
const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  isGroup: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String },
  fileUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId }],
});

// Middleware principal
const dbMiddlewareMessenger = async (req, res, next) => {
  try {
    logger.debug('Middleware: Début du traitement');

    // Récupération du DSP code
    const dsp_code = req.body.dsp_code || req.query.dsp_code || req.params.dsp_code;
    logger.debug(`Middleware: DSP Code reçu : ${dsp_code || 'Non spécifié'}`);

    if (!dsp_code) {
      logger.error('Middleware: dsp_code est requis.');
      return res.status(400).json({ message: 'dsp_code est requis.' });
    }

    // Obtenez la connexion à la base de données
    const connection = await getDatabaseConnection(dsp_code);

    // Ajout des modèles, uniquement si non déjà présents
    if (!connection.models.Conversation) {
      connection.model('Conversation', conversationSchema);
    }
    if (!connection.models.Message) {
      connection.model('Message', messageSchema);
    }

    // Injectez la connexion dans la requête
    req.connection = connection;
    logger.debug('Middleware: Connexion MongoDB injectée dans req.connection.');

    next();
  } catch (error) {
    logger.error('Middleware: Erreur dans dbMiddlewareMessenger :', error.message);
    res.status(500).json({ message: 'Erreur de connexion à la base de données.', error: error.message });
  }
};

module.exports = dbMiddlewareMessenger;
