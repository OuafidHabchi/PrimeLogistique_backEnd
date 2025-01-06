const mongoose = require('mongoose');

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

// Cache des connexions existantes
const connections = {};

// Middleware principal
const dbMiddlewareMessenger = async (req, res, next) => {
  try {
    console.log('Middleware: Début du traitement');
    const dsp_code = req.body.dsp_code || req.query.dsp_code || req.params.dsp_code;
    console.log(`Middleware: DSP Code reçu : ${dsp_code || 'Non spécifié'}`);

    if (!dsp_code) {
      console.error('Middleware: dsp_code est requis.');
      return res.status(400).json({ message: 'dsp_code est requis.' });
    }

    // Mapping des DSP codes aux bases de données
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

    const dbName = databaseMap[dsp_code];
    if (!dbName) {
      console.error(`Middleware: DSP code "${dsp_code}" introuvable.`);
      return res.status(400).json({ message: `DSP code "${dsp_code}" introuvable.` });
    }

    // Réutiliser une connexion existante si elle est prête
    if (connections[dbName]?.readyState === 1) {
      console.log(`Middleware: Connexion réutilisée pour la base : ${dbName}`);
      req.connection = connections[dbName];
    } else {
      console.log(`Middleware: Initialisation d'une nouvelle connexion pour la base : ${dbName}`);
      const uri = process.env.MONGO_URI || `mongodb+srv://wafid:wafid@ouafid.aihn5iq.mongodb.net/${dbName}`;
      const connection = mongoose.createConnection(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
      });

      // Ajout des modèles dans la connexion
      connection.model('Conversation', conversationSchema);
      connection.model('Message', messageSchema);

      // Attendre que la connexion soit complètement établie
      await new Promise((resolve, reject) => {
        connection.on('connected', () => {
          console.log(`Middleware: Connecté à la base ${dbName}`);
          resolve();
        });
        connection.on('error', (err) => {
          console.error(`Middleware: Erreur de connexion à ${dbName} :`, err.message);
          reject(err);
        });
      });

      connections[dbName] = connection;
      req.connection = connection;
    }

    console.log('Middleware: Connexion MongoDB injectée dans req.connection.');
    next();
  } catch (error) {
    console.error('Middleware: Erreur dans dbMiddlewareMessenger :', error.message);
    res.status(500).json({ message: 'Erreur de connexion à la base de données.', error: error.message });
  }
};

// Nettoyage des connexions en cas d'arrêt
process.on('SIGINT', async () => {
  console.log('Middleware: Fermeture des connexions MongoDB...');
  const closePromises = Object.values(connections).map(async (conn) => {
    try {
      await conn.close();
      console.log(`Middleware: Connexion fermée proprement pour la base : ${conn.name}`);
    } catch (err) {
      console.error(`Middleware: Erreur lors de la fermeture de la connexion : ${conn.name}`, err.message);
    }
  });
  await Promise.all(closePromises);
  process.exit(0);
});

module.exports = dbMiddlewareMessenger;
