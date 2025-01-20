const express = require('express');
const multer = require('multer');
const path = require('path');
const dbMiddlewareEquipmentUpdate = require('../midleware/dbMiddlewareEquipmentUpdate'); // Import du middleware
const equipmentUpdateController = require('../controllers/EquipmentUpdateController');

const router = express.Router();

// Configuration de multer pour l'upload des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploadsequipment')); // Dossier d'upload
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route pour envoyer un Equipment Update
router.post(
    '/equipment-updates',
    upload.single('image'), // Utilisation de la clé 'image'
    (req, res, next) => {
      // Log des données reçues avant de passer à la suite
      console.log('Données reçues dans le body route :', req.body);  // Affiche les données du body (nom, van, etc.)
      console.log('Fichier reçu :', req.file);  // Affiche le fichier reçu dans la requête
  
      // Vérification des données dans le body
      if (!req.body.employeeName || !req.body.vanName || !req.body.localTime) {
        console.log('Erreur : Données manquantes', {
          employeeName: req.body.employeeName,
          vanName: req.body.vanName,
          localTime: req.body.localTime,
        });
        return res.status(400).json({ message: 'Les informations de l\'employé, du van et du temps sont requises. routes' });
      }
  
      // Vérification si le fichier a bien été reçu
      if (!req.file) {
        return res.status(400).json({ message: 'L\'image est requise.' });
      }
  
      next(); // Passer au middleware suivant ou au contrôleur
    },
    dbMiddlewareEquipmentUpdate, // Middleware pour initialiser la connexion et les modèles
    equipmentUpdateController.createEquipmentUpdate // Controller qui gère l'ajout
  );
  

// Route pour récupérer les données par date
router.get(
    '/equipment-updates-by-date',
    dbMiddlewareEquipmentUpdate, // Middleware pour initialiser la connexion et les modèles
    equipmentUpdateController.getEquipmentUpdatesByDate // Contrôleur pour gérer la requête
  );
  
  

module.exports = router;
