// routes/vanAssignmentRoutes.js
const express = require('express');
const router = express.Router();
const vanAssignmentController = require('../controllers/vanAssignmentController');

// Route pour créer une nouvelle affectation de véhicule
router.post('/create', vanAssignmentController.createVanAssignment);

// Route pour récupérer toutes les affectations de véhicules
router.get('/all', vanAssignmentController.getAllVanAssignments);

// Route pour récupérer une affectation de véhicule par ID
router.get('/:id', vanAssignmentController.getVanAssignmentById);

// Route pour mettre à jour une affectation de véhicule
router.put('/:id', vanAssignmentController.updateVanAssignment);

// Route pour supprimer une affectation de véhicule
router.delete('/delete/:employeeId/:date', vanAssignmentController.deleteVanAssignment);

// Route pour obtenir les assignations pour une date donnée
router.get('/date/:date', vanAssignmentController.getAssignmentsByDate);

// Route pour mettre à jour une affectation de véhicule by jour
router.put('/assignments/:date/:employeeId', vanAssignmentController.updateAssignmentsByDateAndEmployee);


module.exports = router;
