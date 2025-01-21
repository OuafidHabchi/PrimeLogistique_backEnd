const express = require("express");
const multer = require("multer");
const worningController = require("../controllers/worningController");
const logger = require('../../utils/logger');
const dbMiddlewareWorning = require('../midleware/dbMiddlewareWorning');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuration de multer
const uploadDirectory = path.join(__dirname, '../uploads-wornings');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log(`Dossier des uploads créé : ${uploadDirectory}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Middleware pour loguer les requêtes
router.use((req, res, next) => {
  logger.info(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Routes pour les warnings
router.get("/wornings", dbMiddlewareWorning, worningController.getAllWornings);

router.get("/wornings/:id", dbMiddlewareWorning, worningController.getWorningById);

router.post(
  "/wornings",
  upload.single("photo"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "Photo requise pour créer un warning." });
    }
    next();
  },
  dbMiddlewareWorning,
  worningController.createWorning
);

router.put(
  "/wornings/:id",
  upload.single("photo"),
  (req, res, next) => {
    if (!req.file) {
      console.log("Aucune photo mise à jour pour ce warning.");
    }
    next();
  },
  dbMiddlewareWorning,
  worningController.updateWorning
);

router.delete("/wornings/:id", dbMiddlewareWorning, worningController.deleteWorning);

router.get(
  "/wornings/employe/:employeID",
  dbMiddlewareWorning,
  worningController.getWorningsByEmployeID
);

router.post(
  "/wornings/bulk",
  dbMiddlewareWorning,
  worningController.createMultipleWarnings
);

router.post(
  "/wornings/suspensions/check",
  dbMiddlewareWorning,
  worningController.checkSuspensionsForEmployees
);

router.get(
  "/wornings/templates/get",
  dbMiddlewareWorning,
  worningController.getTemplateWarnings
);

module.exports = router;
