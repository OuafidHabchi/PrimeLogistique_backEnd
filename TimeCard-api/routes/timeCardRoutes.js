const express = require('express');
const timeCardController = require('../controllers/timeCardController');

const router = express.Router();

router.post('/timecards', timeCardController.createTimeCard);
router.get('/timecards', timeCardController.getTimeCards);
router.get('/timecards/:id', timeCardController.getTimeCardById);
router.put('/timecards/:id', timeCardController.updateTimeCard);
router.delete('/timecards/:id', timeCardController.deleteTimeCard);
// Route pour obtenir la fiche de temps par employeeId et day
router.get('/timecards/:employeeId/:day', timeCardController.getTimeCardByEmployeeAndDay);

// Route pour mettre à jour la fiche de temps par employeeId et day
router.put('/timecards/:employeeId/:day', timeCardController.updateOrCreateTimeCard);

// Route to get all time cards for a specific day
router.get('/timecardsss/dday/:day', timeCardController.getTimeCardsByDay);

// Route pour la mise à jour ou création en masse des attributs Cortex
router.post('/timecards/bulk-update-cortex', timeCardController.bulkUpdateOrCreateCortexAttributes);



module.exports = router;

