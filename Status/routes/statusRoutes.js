// /routes/statusRoutes.js
const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

router.post('/create', statusController.createStatus);          // Create
router.get('/all', statusController.getAllStatuses);         // Read All
router.get('/:id', statusController.getStatusById);       // Read One
router.put('/:id', statusController.updateStatus);        // Update
router.delete('/:id', statusController.deleteStatus);     // Delete

module.exports = router;
