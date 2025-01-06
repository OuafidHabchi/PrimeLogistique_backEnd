const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Routes
router.get('/', inventoryController.getAllItems); // GET all items
router.get('/:id', inventoryController.getItemById); // GET an item by ID
router.post('/create', inventoryController.createItems); // CREATE multiple items
router.put('/update', inventoryController.updateItems); // UPDATE multiple items
router.delete('/', inventoryController.clearAllItems); // DELETE all items

module.exports = router;
