const inventoryService = require('../services/inventory.service');
const logger = require('../utils/logger');
const formatJsonApi = require('../utils/jsonapi');

exports.getInventory = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId)) {
      const error = new Error('Invalid product ID');
      error.status = 400;
      throw error;
    }

    const result = await inventoryService.getInventoryByProductId(productId);
    logger.info({ msg: 'Inventory retrieved', productId });
    res.json(formatJsonApi('inventory', result));
  } catch (err) {
    logger.error({ msg: 'Error retrieving inventory', error: err.message });
    next(err);
  }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const quantity = parseInt(req.body.quantity, 10);

    if (isNaN(productId) || isNaN(quantity)) {
      const error = new Error('Invalid product ID or quantity');
      error.status = 400;
      throw error;
    }

    const result = await inventoryService.updateInventory(productId, quantity);
    logger.info({ msg: 'Inventory updated', productId, quantity });
    res.json(formatJsonApi('inventory', result));
  } catch (err) {
    logger.error({ msg: 'Error updating inventory', error: err.message });
    next(err);
  }
};
