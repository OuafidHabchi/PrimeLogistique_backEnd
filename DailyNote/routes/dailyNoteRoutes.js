const express = require('express');
const multer = require('multer');
const dbMiddleware = require('../../utils/middleware');
const dailyNoteController = require('../controllers/dailyNoteController');
const logger = require('../../utils/logger');

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Middleware pour spécifier le modèle nécessaire
router.use((req, res, next) => {
  req.requiredModels = ['DailyNote'];
  logger.debug(`Middleware dailyNoteRoutes : req.requiredModels = ${req.requiredModels}`);
  next();
});

// Appliquer `dbMiddleware` dynamiquement sur les routes daily notes
router.use(dbMiddleware);

router.post('/create', upload.single('photo'), dailyNoteController.createDailyNote);
router.get('/all', dailyNoteController.getAllDailyNotes);
router.get('/by-date', dailyNoteController.getDailyNotesByDate);
router.patch('/mark-as-read', dailyNoteController.markAsRead);
router.get('/details/:noteId', dailyNoteController.getNoteDetails);

module.exports = router;
