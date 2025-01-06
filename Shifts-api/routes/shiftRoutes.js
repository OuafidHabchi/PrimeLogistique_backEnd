const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');

// Route pour créer un shift
router.post('/shifts', shiftController.createShift);

// Route pour mettre à jour un shift
router.put('/shifts/:id', shiftController.updateShift);

// Route pour supprimer un shift
router.delete('/shifts/:id', shiftController.deleteShift);

// Route pour récupérer tous les shifts
router.get('/shifts', shiftController.getAllShifts);

// Route pour récupérer un shift par son nom
router.get('/shifts/name/:name', shiftController.getShiftByName);

// Route pour récupérer un shift par ID
router.get('/shifts/:id', shiftController.getShiftById);

module.exports = router;
