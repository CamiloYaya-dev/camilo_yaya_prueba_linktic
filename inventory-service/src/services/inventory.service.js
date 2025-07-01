const Inventory = require('../models/inventory.model');
const logger = require('../utils/logger');
const axios = require('axios');

async function getProductDetails(productId) {
  try {
    const res = await axios.get(`http://localhost:3000/products/${productId}`, {
      headers: {
        'x-api-key': process.env.PRODUCTS_SERVICE_API_KEY
      }
    });
    return res.data.data.attributes;
  } catch (err) {
    throw new Error('Product not found in product service');
  }
}

async function getInventoryByProductId(productId) {
  try {
    const inventory = await Inventory.findOne({ where: { productId } });
    if (!inventory) {
      const error = new Error('Inventory not found');
      error.status = 404;
      throw error;
    }
    logger.info({ msg: 'Inventory fetched', productId });
    return inventory;
  } catch (err) {
    logger.error({ msg: 'Error retrieving inventory', error: err.message });
    throw err;
  }
}

async function updateInventory(productId, quantity) {
  try {
    await getProductDetails(productId);

    let inventory = await Inventory.findOne({ where: { productId } });

    if (!inventory) {
      inventory = await Inventory.create({ productId, quantity });
    } else {
      inventory.quantity = quantity;
      await inventory.save();
    }

    console.log(`Inventory updated for product ${productId}: quantity set to ${quantity}`);
    return { productId, quantity };
  } catch (err) {
    logger.error({ msg: 'Error updating inventory', productId, error: err.message });
    throw new Error('Error updating inventory: ' + err.message);
  }
}

module.exports = {
  getInventoryByProductId,
  updateInventory,
};
