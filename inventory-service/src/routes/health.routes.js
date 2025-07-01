const express = require('express');
const router = express.Router();
const sequelize = require('../database');
const logger = require('../utils/logger');

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check for inventory service
 *     tags:
 *       - Health
 *     description: Verifica que el servicio de inventario esté funcionando correctamente, incluida la conexión con la base de datos.
 *     responses:
 *       200:
 *         description: Servicio operativo y conexión con la base de datos establecida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 database:
 *                   type: string
 *                   example: up
 *       500:
 *         description: Error en el servicio o fallo al conectar con la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 database:
 *                   type: string
 *                   example: down
 *                 message:
 *                   type: string
 *                   example: "Connection timeout to database"
 */
router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    logger.info({ msg: 'Health check passed', status: 'ok', database: 'up' });
    res.json({ status: 'ok', database: 'up' });
  } catch (err) {
    logger.error({ msg: 'Health check failed', status: 'error', database: 'down', error: err.message });
    res.status(500).json({ status: 'error', database: 'down', message: err.message });
  }
});

module.exports = router;
