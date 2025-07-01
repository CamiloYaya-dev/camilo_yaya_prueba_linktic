const express = require('express');
const router = express.Router();
const sequelize = require('../database');
const logger = require('../utils/logger');

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
