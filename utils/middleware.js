const mongoose = require('mongoose');
const getDatabaseConnection = require('./database');
const getDynamicModel = require('./dynamicModel');
const modelsMap = require('./modelsMap');

const dbMiddleware = async (req, res, next) => {
  const dsp_code = req.body.dsp_code || req.query.dsp_code || req.params.dsp_code;
  console.log(`DSP Code reçu : ${dsp_code || 'Non spécifié'}`);

  if (!dsp_code) {
    console.error('Erreur : dsp_code est requis.');
    return res.status(400).json({ message: 'dsp_code est requis.' });
  }

  try {
    let connection;
    try {
      connection = await getDatabaseConnection(dsp_code);
      if (!connection) {
        throw new Error('Connexion MongoDB introuvable.');
      }
    } catch (dbError) {
      console.error('Erreur lors de la connexion à MongoDB :', dbError.message);
      throw dbError;
    } finally {
    }

    try {
      Object.entries(modelsMap).forEach(([modelName, model]) => {
        try {
          const schema = model.schema || model;

          if (!schema || !(schema instanceof mongoose.Schema)) {
            throw new Error(`Schema invalide pour le modèle "${modelName}"`);
          }

          if (!connection.models[modelName]) {
            connection.model(modelName, schema);
          } else {
            console.log(`Modèle déjà existant : ${modelName}`);
          }
        } catch (modelError) {
          console.error(`Erreur lors de l'initialisation du modèle "${modelName}" :`, modelError.message);
          throw modelError;
        }
      });
      console.log('Tous les modèles ont été initialisés avec succès.');
    } catch (initError) {
      console.error('Erreur lors de l\'initialisation des modèles :', initError.message);
      throw initError;
    } finally {
      console.timeEnd('Model Initialization'); // Fin du log d'initialisation des modèles
    }

    req.connection = connection;
    console.log('Connexion MongoDB injectée dans req.connection.');

    next(); // Passer au middleware suivant
  } catch (error) {
    console.error('Erreur dans dbMiddleware :', error.message);
    if (error.message.includes('dsp code')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: 'Erreur lors de la connexion à la base de données.',
      error: error.message,
    });
  }
};

module.exports = dbMiddleware;
