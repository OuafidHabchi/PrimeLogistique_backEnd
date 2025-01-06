const express = require('express');
const router = express.Router();
const disponibiliteController = require('../controllers/disponibiliteController');

// Créer une disponibilité
router.post('/disponibilites/create', disponibiliteController.createDisponibilite);

// Récupérer toutes les disponibilités
router.get('/disponibilites', disponibiliteController.getAllDisponibilites);

// Récupérer une disponibilité par son ID
router.get('/disponibilites/:id', disponibiliteController.getDisponibiliteById);

// Mettre à jour une disponibilité
router.put('/disponibilites/:id', disponibiliteController.updateDisponibilite);

// Supprimer une disponibilité
router.delete('/disponibilites/:id', disponibiliteController.deleteDisponibilite);

// Supprimer des disponibilités par Shift ID
router.delete('/disponibilites/shift/:shiftId', disponibiliteController.deleteDisponibilitesByShiftId);

// Mise à jour en masse des disponibilités
router.post('/updateDisponibilites', disponibiliteController.updateMultipleDisponibilites);

// Confirmer la mise à jour en masse des disponibilités
router.post('/updateDisponibilites/confirmation', disponibiliteController.updateMultipleDisponibilitesConfirmation);

// Récupérer les disponibilités par Employee ID
router.get('/disponibilites/employee/:employeeId', disponibiliteController.getDisponibilitesByEmployeeId);

// Récupérer les disponibilités par Employee ID et jour
router.get('/disponibilites/employee/:employeeId/day/:selectedDay', disponibiliteController.getDisponibilitesByEmployeeAndDay);

// Mettre à jour la présence d'une disponibilité par ID
router.put('/disponibilites/:id/presence', disponibiliteController.updateDisponibilitePresenceById);

module.exports = router;
