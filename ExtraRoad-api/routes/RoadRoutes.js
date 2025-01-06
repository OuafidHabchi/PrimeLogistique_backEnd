const express = require('express');
const router = express.Router();
const RoadController = require('../controllers/RoadController');

// CRUD routes
router.get('/', RoadController.getAllRoads);
router.get('/:id', RoadController.getRoadById);
router.post('/create', RoadController.createRoad);
router.put('/:id', RoadController.updateRoad);
router.delete('/:id', RoadController.deleteRoad);
// Récupérer les routes par date
router.get('/bydate/get', RoadController.getRoadsByDate);

module.exports = router;
