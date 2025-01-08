const express = require("express");
const dbMiddleware = require('../../utils/middleware');
const multer = require("multer");
const worningController = require("../controllers/worningController");
const logger = require('../../utils/logger');

const router = express.Router();

// Configure `multer` pour stocker les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

// Middleware pour spécifier le modèle nécessaire
router.use((req, res, next) => {
  req.requiredModels = ['Worning'];
  logger.debug(`Middleware worningRoutes : req.requiredModels = ${req.requiredModels}`);
  next();
});

// Appliquer `dbMiddleware` dynamiquement sur les routes wornings
router.use(dbMiddleware);

// Routes pour les warnings
router.get("/wornings", worningController.getAllWornings);
router.get("/wornings/:id", worningController.getWorningById);

// Route POST avec support des fichiers
router.post("/wornings", upload.single("photo"), worningController.createWorning);

router.put("/wornings/:id", upload.single("photo"), worningController.updateWorning);
router.delete("/wornings/:id", worningController.deleteWorning);

// Obtenir tous les warnings par employeID
router.get("/wornings/employe/:employeID", worningController.getWorningsByEmployeID);

// Route pour créer plusieurs warnings
router.post("/wornings/bulk", upload.array("photos"), worningController.createMultipleWarnings);

// Vérifier les suspensions pour les employés
router.post('/wornings/suspensions/check', worningController.checkSuspensionsForEmployees);

module.exports = router;
