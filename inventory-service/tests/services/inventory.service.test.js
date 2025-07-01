const inventoryService = require('../../src/services/inventory.service');
const Inventory = require('../../src/models/inventory.model');
const axios = require('axios');
const logger = require('../../src/utils/logger');

jest.mock('../../src/models/inventory.model');
jest.mock('axios');
jest.mock('../../src/utils/logger');

describe('inventory.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInventoryByProductId', () => {
    test('should return inventory if found', async () => {
      const mockInventory = { productId: 1, quantity: 5 };
      Inventory.findOne.mockResolvedValue(mockInventory);

      const result = await inventoryService.getInventoryByProductId(1);

      expect(result).toBe(mockInventory);
      expect(Inventory.findOne).toHaveBeenCalledWith({ where: { productId: 1 } });
      expect(logger.info).toHaveBeenCalledWith({ msg: 'Inventory fetched', productId: 1 });
    });

    test('should throw 404 if inventory not found', async () => {
      Inventory.findOne.mockResolvedValue(null);

      await expect(inventoryService.getInventoryByProductId(1)).rejects.toThrow('Inventory not found');
      expect(logger.error).toHaveBeenCalled();
    });

    test('should log and throw on DB error', async () => {
      Inventory.findOne.mockRejectedValue(new Error('DB failure'));

      await expect(inventoryService.getInventoryByProductId(1)).rejects.toThrow('DB failure');
      expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Error retrieving inventory',
        error: 'DB failure',
      }));
    });
  });

  describe('updateInventory', () => {
    test('should create new inventory if not exists', async () => {
      Inventory.findOne.mockResolvedValue(null);
      axios.get.mockResolvedValue({ data: { data: { attributes: {} } } });
      Inventory.create.mockResolvedValue({ productId: 1, quantity: 10 });

      const result = await inventoryService.updateInventory(1, 10);

      expect(Inventory.create).toHaveBeenCalledWith({ productId: 1, quantity: 10 });
      expect(result).toEqual({ productId: 1, quantity: 10 });
    });

    test('should update existing inventory', async () => {
      const mockInventory = { productId: 1, quantity: 5, save: jest.fn() };
      Inventory.findOne.mockResolvedValue(mockInventory);
      axios.get.mockResolvedValue({ data: { data: { attributes: {} } } });

      const result = await inventoryService.updateInventory(1, 20);

      expect(mockInventory.quantity).toBe(20);
      expect(mockInventory.save).toHaveBeenCalled();
      expect(result).toEqual({ productId: 1, quantity: 20 });
    });

    test('should throw if product does not exist in product service', async () => {
      axios.get.mockRejectedValue(new Error('Not found'));

      await expect(inventoryService.updateInventory(1, 5)).rejects.toThrow('Error updating inventory');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
