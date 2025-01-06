const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/clothesAssignmentController');

// Routes CRUD
router.get('/assignments', assignmentController.getAllAssignments);
router.get('/assignments/:id', assignmentController.getAssignmentById);
router.post('/assignments', assignmentController.createAssignment);
router.delete('/assignments/:id', assignmentController.deleteAssignment);

module.exports = router;
