const express = require('express');
const router = express.Router();
const powerBankController = require('../controllers/powerBankController');

// Créer un nouveau powerbank
router.post('/powerbanks', powerBankController.createPowerBank);

// Obtenir tous les powerbanks
router.get('/powerbanks', powerBankController.getAllPowerBanks);

// Obtenir un powerbank par ID
router.get('/powerbanks/:id', powerBankController.getPowerBankById);

// Mettre à jour un powerbank
router.put('/powerbanks/:id', powerBankController.updatePowerBank);

// Supprimer un powerbank
router.delete('/powerbanks/:id', powerBankController.deletePowerBank);

// Nouvelle route pour les powerbanks fonctionnels
router.get('/powerbanks/functional/all', powerBankController.getFunctionalPowerBanks);


module.exports = router;
