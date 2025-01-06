const express = require('express');
const router = express.Router();
const procedureController = require('../controllers/procedureController');

// Routes CRUD
router.get('/', procedureController.getAllProcedures); // GET toutes les procédures
router.post('/', procedureController.createProcedure); // POST créer une procédure
router.put('/:id', procedureController.updateProcedure); // PUT mettre à jour une procédure
router.delete('/:id', procedureController.deleteProcedure); // DELETE supprimer une procédure
router.put('/:id/seen', procedureController.addToSeen); // PUT ajouter un utilisateur à la liste 'seen'

module.exports = router;
