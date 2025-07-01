const controller = require('../../src/controllers/inventory.controller');
const inventoryService = require('../../src/services/inventory.service');
const logger = require('../../src/utils/logger');
const formatJsonApi = require('../../src/utils/jsonapi');

jest.mock('../../src/services/inventory.service');
jest.mock('../../src/utils/logger');

describe('Inventory Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getInventory', () => {
    test('should return inventory for valid productId', async () => {
      const mockInventory = { productId: 1, quantity: 5 };
      req.params.productId = '1';
      inventoryService.getInventoryByProductId.mockResolvedValue(mockInventory);

      await controller.getInventory(req, res, next);

      expect(inventoryService.getInventoryByProductId).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(formatJsonApi('inventory', mockInventory));
      expect(logger.info).toHaveBeenCalledWith({ msg: 'Inventory retrieved', productId: 1 });
    });

    test('should handle invalid productId', async () => {
      req.params.productId = 'abc';

      await controller.getInventory(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid product ID',
        status: 400,
      }));
      expect(logger.error).toHaveBeenCalled();
    });

    test('should handle service error', async () => {
      req.params.productId = '1';
      const error = new Error('DB error');
      inventoryService.getInventoryByProductId.mockRejectedValue(error);

      await controller.getInventory(req, res, next);

      expect(logger.error).toHaveBeenCalledWith({
        msg: 'Error retrieving inventory',
        error: error.message
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateInventory', () => {
    test('should update inventory for valid productId and quantity', async () => {
      const result = { productId: 1, quantity: 10 };
      req.params.productId = '1';
      req.body.quantity = 10;
      inventoryService.updateInventory.mockResolvedValue(result);

      await controller.updateInventory(req, res, next);

      expect(inventoryService.updateInventory).toHaveBeenCalledWith(1, 10);
      expect(res.json).toHaveBeenCalledWith(formatJsonApi('inventory', result));
      expect(logger.info).toHaveBeenCalledWith({ msg: 'Inventory updated', productId: 1, quantity: 10 });
    });

    test('should handle invalid productId or quantity', async () => {
      req.params.productId = '1';
      req.body.quantity = 'abc';

      await controller.updateInventory(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Invalid product ID or quantity',
        status: 400,
      }));
      expect(logger.error).toHaveBeenCalled();
    });

    test('should handle service error', async () => {
      req.params.productId = '1';
      req.body.quantity = 5;
      const error = new Error('Fail');
      inventoryService.updateInventory.mockRejectedValue(error);

      await controller.updateInventory(req, res, next);

      expect(logger.error).toHaveBeenCalledWith({
        msg: 'Error updating inventory',
        error: error.message
      });
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
