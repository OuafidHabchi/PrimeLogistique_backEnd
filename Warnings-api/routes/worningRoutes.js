const express = require("express");
const router = express.Router();
const multer = require("multer");
const worningController = require("../controllers/worningController");

// Configure `multer` pour stocker les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

// Routes pour les warnings
router.get("/wornings", worningController.getAllWornings);
router.get("/wornings/:id", worningController.getWorningById);

// Route POST avec support des fichiers
router.post("/wornings", upload.single("photo"), worningController.createWorning);

router.put("/wornings/:id", upload.single("photo"), worningController.updateWorning);
router.delete("/wornings/:id", worningController.deleteWorning);

// Obtenir tous les warnings par employeID
router.get("/wornings/employe/:employeID", worningController.getWorningsByEmployeID);

// Récupérer les suspensions par employé et période
// router.get("/wornings/suspensions/get", worningController.getSuspensionsByEmployeAndDateRange);

// Route pour créer plusieurs warnings
router.post("/wornings/bulk", upload.array("photos"), worningController.createMultipleWarnings);

router.post('/wornings/suspensions/check', worningController.checkSuspensionsForEmployees);


module.exports = router;
