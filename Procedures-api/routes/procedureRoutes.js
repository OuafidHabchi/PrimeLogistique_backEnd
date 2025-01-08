const express = require('express');
const dbMiddleware = require('../../utils/middleware');
const procedureController = require('../controllers/procedureController');
const logger = require('../../utils/logger');
const router = express.Router();

// Middleware pour spécifier le modèle nécessaire
router.use((req, res, next) => {
  req.requiredModels = ['Procedure'];
  logger.debug(`Middleware procedureRoutes : req.requiredModels = ${req.requiredModels}`);
  next();
});

// Appliquer `dbMiddleware` dynamiquement sur les routes procedures
router.use(dbMiddleware);

// Routes CRUD
router.get('/', procedureController.getAllProcedures); // GET toutes les procédures
router.post('/', procedureController.createProcedure); // POST créer une procédure
router.put('/:id', procedureController.updateProcedure); // PUT mettre à jour une procédure
router.delete('/:id', procedureController.deleteProcedure); // DELETE supprimer une procédure
router.put('/:id/seen', procedureController.addToSeen); // PUT ajouter un utilisateur à la liste 'seen'

module.exports = router;
