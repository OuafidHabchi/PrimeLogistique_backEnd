const express = require('express');
const multer = require('multer');
const dailyNoteController = require('../controllers/dailyNoteController');

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/create', upload.single('photo'), dailyNoteController.createDailyNote);
router.get('/all', dailyNoteController.getAllDailyNotes);
router.get('/by-date', dailyNoteController.getDailyNotesByDate);
router.patch('/mark-as-read', dailyNoteController.markAsRead);
router.get('/details/:noteId', dailyNoteController.getNoteDetails);

module.exports = router;
