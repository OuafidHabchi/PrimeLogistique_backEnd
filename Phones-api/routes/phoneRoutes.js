const express = require('express');
const router = express.Router();
const phoneController = require('../controllers/phoneController');

// Créer un nouveau phone
router.post('/phones/create', phoneController.createPhone);

// Obtenir tous les phones
router.get('/phones', phoneController.getAllPhones);

// Obtenir un phone par ID
router.get('/phones/:id', phoneController.getPhoneById);

// Mettre à jour un phone
router.put('/phones/:id', phoneController.updatePhone);

// Supprimer un phone
router.delete('/phones/:id', phoneController.deletePhone);

// Nouvelle route pour les téléphones fonctionnels
router.get('/phones/functional/all', phoneController.getFunctionalPhones);


module.exports = router;
