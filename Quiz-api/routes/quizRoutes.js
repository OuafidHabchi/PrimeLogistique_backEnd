const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Routes CRUD
router.post('/', quizController.createQuiz);         // Créer un quiz
router.get('/', quizController.getAllQuizzes);       // Récupérer tous les quizzes
router.get('/:id', quizController.getQuizById);      // Récupérer un quiz par ID
router.put('/:id', quizController.updateQuiz);       // Mettre à jour un quiz
router.delete('/:id', quizController.deleteQuiz);    // Supprimer un quiz

module.exports = router;
