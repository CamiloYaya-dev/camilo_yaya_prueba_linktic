const app = require('./app');
const logger = require('./utils/logger');
const sequelize = require('./database');
require('./models/inventory.model');

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  logger.info('Database synced');
  app.listen(PORT, () => {
    logger.info(`Inventory service running on port ${PORT}`);
  });
});
