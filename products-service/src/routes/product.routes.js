const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Adds a new product to the database. Requires a valid `x-api-key` header for authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API Key for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sample Product
 *               description:
 *                 type: string
 *                 example: A description of the product
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized – missing or invalid API key
 */
router.post('/', controller.createProduct);

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List all products
 *     description: Retrieves a list of all products. Requires a valid `x-api-key` header for authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API Key for authentication
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Sample Product
 *                       description:
 *                         type: string
 *                         example: A description of the product
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 19.99
 *       401:
 *         description: Unauthorized – missing or invalid API key
 */
router.get('/', controller.listProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieves a product by its ID. Requires a valid `x-api-key` header for authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API Key for authentication
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Sample Product
 *                     description:
 *                       type: string
 *                       example: A description of the product
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 19.99
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized – missing or invalid API key
 */
router.get('/:id', controller.getProduct);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     description: Updates a product's information. Requires a valid `x-api-key` header for authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API Key for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Product
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 29.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized – missing or invalid API key
 */
router.put('/:id', controller.updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     description: Deletes a product from the system. Requires a valid `x-api-key` header for authentication.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API Key for authentication
 *     responses:
 *       204:
 *         description: Product deleted successfully (no content)
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized – missing or invalid API key
 */
router.delete('/:id', controller.deleteProduct);

module.exports = router;
