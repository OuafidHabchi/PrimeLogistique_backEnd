// routes/clothesRoutes.js
const express = require('express');
const router = express.Router();
const clothesController = require('../controllers/clothesController');

// Routes CRUD
router.get('/clothes', clothesController.getAllClothes);
router.get('/clothes/:id', clothesController.getClothesById);
router.post('/clothes', clothesController.createClothes);
router.put('/clothes/:id', clothesController.updateClothes);
router.delete('/clothes/:id', clothesController.deleteClothes);

module.exports = router;
