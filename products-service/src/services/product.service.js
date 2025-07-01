const Product = require('../models/product.model');
const logger = require('../utils/logger');

async function create(data) {
  try {
    const product = await Product.create(data);
    logger.info({ product }, 'Product created');
    return product;
  } catch (err) {
    logger.error({ err }, 'Error creating product');
    throw new Error('Error creating product: ' + err.message);
  }
}

async function findById(id) {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      logger.warn({ id }, 'Product not found');
      throw error;
    }
    return product;
  } catch (err) {
    if (!err.status) {
      err.message = 'Error retrieving product: ' + err.message;
      logger.error({ err, id }, 'Unexpected error retrieving product');
    }
    throw err;
  }
}

async function update(id, data) {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      logger.warn({ id }, 'Product not found for update');
      throw error;
    }
    await product.update(data);
    logger.info({ id, updates: data }, 'Product updated');
    return product;
  } catch (err) {
    logger.error({ err, id, data }, 'Error updating product');
    throw new Error('Error updating product: ' + err.message);
  }
}

async function remove(id) {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      logger.warn({ id }, 'Product not found for deletion');
      throw error;
    }
    await product.update({ isActive: false });
    logger.info({ id }, 'Product marked as inactive');
    return true;
  } catch (err) {
    logger.error({ err, id }, 'Error deleting product');
    throw new Error('Error deleting product: ' + err.message);
  }
}

async function findAll({ page = 1, limit = 10, isActive }) {
  try {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (isNaN(parsedPage) || isNaN(parsedLimit)) {
      const error = new Error('Invalid pagination parameters');
      error.status = 400;
      logger.warn({ page, limit }, 'Invalid pagination parameters');
      throw error;
    }

    const offset = (parsedPage - 1) * parsedLimit;
    const where = {};

    if (isActive === 'true') where.isActive = true;
    else if (isActive === 'false') where.isActive = false;

    const products = await Product.findAll({ where, offset, limit: parsedLimit });
    logger.info({ page, limit: parsedLimit, isActive }, 'Products retrieved');
    return products;
  } catch (err) {
    logger.error({ err, page, limit, isActive }, 'Error listing products');
    throw new Error('Error listing products: ' + err.message);
  }
}

module.exports = { create, findById, update, remove, findAll };
