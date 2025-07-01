const app = require('./app');
const logger = require('./utils/logger');
const sequelize = require('./database');
require('./models/product.model');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  logger.info('Database synced');
  app.listen(PORT, () => {
    logger.info(`Products service running on port ${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/docs`);
  });
});
