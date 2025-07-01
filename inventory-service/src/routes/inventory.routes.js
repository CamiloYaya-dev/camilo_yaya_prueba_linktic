const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.get('/:productId', inventoryController.getInventory);
router.patch('/:productId', inventoryController.updateInventory);

module.exports = router;
