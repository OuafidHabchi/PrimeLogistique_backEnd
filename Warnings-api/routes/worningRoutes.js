const express = require("express");
const multer = require("multer");
const worningController = require("../controllers/worningController");
const logger = require('../../utils/logger');
const dbMiddlewareWorning = require('../midleware/dbMiddlewareWorning'); // Middleware personnalisé
const path = require('path');
const fs = require('fs');

// Configuration de multer
const uploadDirectory = path.join(__dirname, '../uploads-wornings');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const router = express.Router();

// Routes pour les warnings
router.get("/wornings", dbMiddlewareWorning, worningController.getAllWornings);
router.get("/wornings/:id", dbMiddlewareWorning, worningController.getWorningById);

// Route POST : upload d'abord, puis middleware et contrôleur
router.post(
  "/wornings",
  upload.single("photo"), // Enregistrement du fichier avant d'exécuter les autres middlewares
  dbMiddlewareWorning, // Middleware personnalisé pour ajouter le modèle
  worningController.createWorning // Contrôleur pour traiter les données
);

// Route PUT : upload d'abord, puis middleware et contrôleur
router.put(
  "/wornings/:id",
  upload.single("photo"),
  dbMiddlewareWorning,
  worningController.updateWorning
);

// Route DELETE : pas d'upload nécessaire
router.delete(
  "/wornings/:id",
  dbMiddlewareWorning,
  worningController.deleteWorning
);

// Route GET : warnings par employé
router.get(
  "/wornings/employe/:employeID",
  dbMiddlewareWorning,
  worningController.getWorningsByEmployeID
);

// Route POST pour créer plusieurs warnings
router.post(
  "/wornings/bulk",
  upload.array("photos"),
  dbMiddlewareWorning,
  worningController.createMultipleWarnings
);

// Route pour vérifier les suspensions des employés
router.post(
  "/wornings/suspensions/check",
  dbMiddlewareWorning,
  worningController.checkSuspensionsForEmployees
);

// Route GET : warnings with template === true
router.get(
  "/wornings/templates/get", // Define the route endpoint
  dbMiddlewareWorning, // Middleware to add the model
  worningController.getTemplateWarnings // Controller function to handle the request
);


module.exports = router;
