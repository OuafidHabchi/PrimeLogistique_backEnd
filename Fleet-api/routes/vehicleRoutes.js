// /routes/vehicleRoutes.js
const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const router = express.Router();

// Route pour ajouter un véhicule
router.post('/add', vehicleController.addVehicle);

// Route pour récupérer tous les véhicules
router.get('/all', vehicleController.getAllVehicles);

// Route pour récupérer un véhicule par ID
router.get('/:id', vehicleController.getVehicleById);

// Route pour mettre à jour un véhicule par ID
router.put('/:id', vehicleController.updateVehicleById);

// Route pour supprimer un véhicule par ID
router.delete('/:id', vehicleController.deleteVehicleById);

module.exports = router;
