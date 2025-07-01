const productService = require('../../src/services/product.service');
const Product = require('../../src/models/product.model');
const sequelize = require('../../src/database');

jest.mock('../../src/models/product.model');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create() should create a product', async () => {
    const mockProduct = { name: 'Mouse', price: 99.99 };
    Product.create.mockResolvedValue(mockProduct);

    const result = await productService.create(mockProduct);
    expect(Product.create).toHaveBeenCalledWith(mockProduct);
    expect(result).toEqual(mockProduct);
  });

  test('create() should throw error if Product.create fails', async () => {
    Product.create.mockRejectedValue(new Error('DB error'));
    await expect(productService.create({})).rejects.toThrow('Error creating product: DB error');
  });

  test('findById() should return product if found', async () => {
    const product = { id: 1 };
    Product.findByPk.mockResolvedValue(product);

    const result = await productService.findById(1);
    expect(result).toEqual(product);
  });

  test('findById() should handle unexpected errors and format the message', async () => {
    Product.findByPk.mockRejectedValue(new Error('Sequelize error'));

    await expect(productService.findById(1)).rejects.toThrow(
      'Error retrieving product: Sequelize error'
    );
  });

  test('findById() should throw 404 if not found', async () => {
    Product.findByPk.mockResolvedValue(null);

    await expect(productService.findById(999)).rejects.toThrow('Product not found');
  });

  test('update() should update and return product', async () => {
    const product = {
      id: 1,
      update: jest.fn().mockResolvedValue(true),
    };
    Product.findByPk.mockResolvedValue(product);

    const result = await productService.update(1, { name: 'Updated' });
    expect(product.update).toHaveBeenCalledWith({ name: 'Updated' });
    expect(result).toEqual(product);
  });

  test('update() should throw 404 if product not found', async () => {
    Product.findByPk.mockResolvedValue(null);

    await expect(productService.update(2, {})).rejects.toThrow('Product not found');
  });

  test('remove() should mark product as inactive (soft delete)', async () => {
    const product = {
      id: 1,
      update: jest.fn().mockResolvedValue(true),
    };
    Product.findByPk.mockResolvedValue(product);

    const result = await productService.remove(1);
    expect(product.update).toHaveBeenCalledWith({ isActive: false });
    expect(result).toBe(true);
  });

  test('remove() should throw 404 if not found', async () => {
    Product.findByPk.mockResolvedValue(null);

    await expect(productService.remove(2)).rejects.toThrow('Product not found');
  });

  test('findAll() should return products with default filters', async () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    Product.findAll.mockResolvedValue(mockData);

    const result = await productService.findAll({ page: 1, limit: 10 });
    expect(Product.findAll).toHaveBeenCalledWith({ where: {}, offset: 0, limit: 10 });
    expect(result).toEqual(mockData);
  });

  test('findAll() should filter by isActive=true', async () => {
    const mockData = [{ id: 1, isActive: true }];
    Product.findAll.mockResolvedValue(mockData);

    const result = await productService.findAll({ page: 1, limit: 10, isActive: 'true' });
    expect(Product.findAll).toHaveBeenCalledWith({
      where: { isActive: true },
      offset: 0,
      limit: 10,
    });
    expect(result).toEqual(mockData);
  });

  test('findAll() should filter by isActive=false', async () => {
    const mockData = [{ id: 2, isActive: false }];
    Product.findAll.mockResolvedValue(mockData);

    const result = await productService.findAll({ page: 1, limit: 10, isActive: 'false' });
    expect(Product.findAll).toHaveBeenCalledWith({
      where: { isActive: false },
      offset: 0,
      limit: 10,
    });
    expect(result).toEqual(mockData);
  });

  test('findAll() should throw 400 if page or limit is not a number', async () => {
    await expect(productService.findAll({ page: 'a', limit: 'b' })).rejects.toThrow(
      'Invalid pagination parameters'
    );
  });

  test('findAll() should use defaults when page and limit are missing', async () => {
    const mockData = [{ id: 1 }];
    Product.findAll.mockResolvedValue(mockData);

    const result = await productService.findAll({});
    expect(Product.findAll).toHaveBeenCalledWith({
      where: {},
      offset: 0,
      limit: 10,
    });
    expect(result).toEqual(mockData);
  });

  test('findAll() should throw error if Product.findAll fails', async () => {
    Product.findAll.mockRejectedValue(new Error('Query failed'));

    await expect(productService.findAll({ page: 1, limit: 10 })).rejects.toThrow(
      'Error listing products: Query failed'
    );
  });

});
