const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

/**
 * @openapi
 * /inventory/{productId}:
 *   get:
 *     summary: Get inventory by product ID
 *     description: Retrieves inventory details for the specified product. Requires an `x-api-key` header for authentication.
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: Internal API Key for authentication
 *     responses:
 *       200:
 *         description: Inventory information
 *       400:
 *         description: Invalid product ID
 *       404:
 *         description: Inventory not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:productId', inventoryController.getInventory);

/**
 * @openapi
 * /inventory/{productId}:
 *   patch:
 *     summary: Update inventory for a product
 *     description: Updates the inventory quantity for a specific product. Requires an `x-api-key` header for authentication.
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
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
 *               quantity:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Inventory updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.patch('/:productId', inventoryController.updateInventory);

module.exports = router;
