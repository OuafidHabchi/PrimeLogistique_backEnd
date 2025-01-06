// routes/reportIssuesRoutes.js
const express = require('express');
const router = express.Router();
const reportIssuesController = require('../controllers/reportIssuesController');

// CRUD routes
router.post('/create', reportIssuesController.createReportIssue);
router.get('/all', reportIssuesController.getAllReportIssues);
router.get('/reportIssues/:id', reportIssuesController.getReportIssueById);
router.put('/update/:id', reportIssuesController.updateReportIssue);
router.delete('/delete/:id', reportIssuesController.deleteReportIssue);
router.delete('/van/:vanId', reportIssuesController.deleteReportIssuesByVanId);


module.exports = router;
