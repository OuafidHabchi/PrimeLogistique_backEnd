const express = require('express');
const dbMiddleware = require('../../utils/middleware');
const quizController = require('../controllers/quizController');
const logger = require('../../utils/logger');
const router = express.Router();

// Middleware pour spécifier le modèle nécessaire
router.use((req, res, next) => {
  req.requiredModels = ['Quiz'];
  logger.debug(`Middleware quizRoutes : req.requiredModels = ${req.requiredModels}`);
  next();
});

// Appliquer `dbMiddleware` dynamiquement sur les routes quizzes
router.use(dbMiddleware);

// Routes CRUD
router.post('/', quizController.createQuiz);         // Créer un quiz
router.get('/', quizController.getAllQuizzes);       // Récupérer tous les quizzes
router.get('/:id', quizController.getQuizById);      // Récupérer un quiz par ID
router.put('/:id', quizController.updateQuiz);       // Mettre à jour un quiz
router.delete('/:id', quizController.deleteQuiz);    // Supprimer un quiz

module.exports = router;
