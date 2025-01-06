const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Routes pour les commentaires
router.post('/create', commentController.createComment); // Créer un commentaire
router.get('/', commentController.getAllComments); // Récupérer tous les commentaires
router.get('/:idEmploye', commentController.getCommentsByEmployeId); // Récupérer les commentaires par ID employé
router.put('/:id', commentController.updateComment); // Mettre à jour un commentaire par ID
router.delete('/:id', commentController.deleteComment); // Supprimer un commentaire par ID
router.get('/date/:date', commentController.getCommentsByDate); // Récupérer les commentaires par date

module.exports = router;
