const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  logger.info({ msg: 'Health check passed', status: 'ok' });
  res.json({ status: 'ok' });
});

module.exports = router;
