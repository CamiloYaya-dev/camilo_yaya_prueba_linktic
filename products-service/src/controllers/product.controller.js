const productService = require('../services/product.service');
const { formatJsonApi } = require('../utils/jsonapi');
const logger = require('../utils/logger');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    logger.info({ msg: 'Product created', product });
    res.status(201).json(formatJsonApi('products', product));
  } catch (err) {
    logger.error({ msg: 'Error creating product', error: err.message });
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    res.json(formatJsonApi('products', product));
  } catch (err) {
    logger.error({ msg: 'Error fetching product', error: err.message });
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    logger.info({ msg: 'Product updated', product });
    res.json(formatJsonApi('products', product));
  } catch (err) {
    logger.error({ msg: 'Error updating product', error: err.message });
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    await product.update({ isActive: false });
    logger.info({ msg: 'Product marked as inactive', id: product.id });
    res.status(204).send();
  } catch (err) {
    logger.error({ msg: 'Error deleting product', error: err.message });
    next(err);
  }
};

exports.listProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const products = await productService.findAll({ page, limit, isActive });
    logger.info({ msg: 'Product list retrieved', count: products.length });
    res.json(formatJsonApi('products', products));
  } catch (err) {
    logger.error({ msg: 'Error listing products', error: err.message });
    next(err);
  }
};
