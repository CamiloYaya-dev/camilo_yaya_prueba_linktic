const controller = require('../../src/controllers/product.controller');
const productService = require('../../src/services/product.service');
const logger = require('../../src/utils/logger');
const { formatJsonApi } = require('../../src/utils/jsonapi');

jest.mock('../../src/services/product.service');
jest.mock('../../src/utils/logger');

describe('Product Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('createProduct should create and return a product', async () => {
    const mockProduct = { id: 1 };
    productService.create.mockResolvedValue(mockProduct);
    req.body = { name: 'Zapatos' };

    await controller.createProduct(req, res, next);

    expect(productService.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(formatJsonApi('products', mockProduct));
    expect(logger.info).toHaveBeenCalled();
  });

  test('createProduct should handle error', async () => {
    const error = new Error('DB error');
    productService.create.mockRejectedValue(error);

    await controller.createProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(logger.error).toHaveBeenCalled();
  });

  test('getProduct should return product by ID', async () => {
    const product = { id: 1 };
    productService.findById.mockResolvedValue(product);
    req.params.id = 1;

    await controller.getProduct(req, res, next);

    expect(res.json).toHaveBeenCalledWith(formatJsonApi('products', product));
  });

  test('getProduct should handle not found', async () => {
    productService.findById.mockResolvedValue(null);
    req.params.id = 99;

    await controller.getProduct(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith({
        error: 'Product not found',
        msg: 'Error fetching product'
    });
    });


  test('updateProduct should return updated product', async () => {
    const updated = { id: 1 };
    productService.update.mockResolvedValue(updated);
    req.params.id = 1;
    req.body = { name: 'Updated' };

    await controller.updateProduct(req, res, next);

    expect(res.json).toHaveBeenCalledWith(formatJsonApi('products', updated));
    expect(logger.info).toHaveBeenCalled();
  });

  test('updateProduct should handle not found', async () => {
    productService.update.mockResolvedValue(null);
    req.params.id = 999;

    await controller.updateProduct(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith({
        error: 'Product not found',
        msg: 'Error updating product'
    });
  });


  test('deleteProduct should mark as inactive', async () => {
    const product = { id: 1, update: jest.fn() };
    productService.findById.mockResolvedValue(product);
    req.params.id = 1;

    await controller.deleteProduct(req, res, next);

    expect(product.update).toHaveBeenCalledWith({ isActive: false });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalled();
  });

  test('deleteProduct should handle not found', async () => {
    productService.findById.mockResolvedValue(null);
    req.params.id = 404;

    await controller.deleteProduct(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith({
        error: 'Product not found',
        msg: 'Error deleting product'
    });
  });

  test('listProducts should return paginated products', async () => {
    const list = [{ id: 1 }, { id: 2 }];
    productService.findAll.mockResolvedValue(list);
    req.query = { page: 1, limit: 10 };

    await controller.listProducts(req, res, next);

    expect(productService.findAll).toHaveBeenCalledWith(req.query);
    expect(res.json).toHaveBeenCalledWith(formatJsonApi('products', list));
    expect(logger.info).toHaveBeenCalledWith({
        msg: 'Product list retrieved',
        count: list.length,
    });
  });

  test('listProducts should handle error', async () => {
    const error = new Error('fail');
    productService.findAll.mockRejectedValue(error);

    await controller.listProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(logger.error).toHaveBeenCalledWith({
        error: error.message,
        msg: 'Error listing products'
    });
  });
});
