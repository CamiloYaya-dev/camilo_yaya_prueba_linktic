require('dotenv').config();
const express = require('express');
const inventoryRoutes = require('./routes/inventory.routes');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/inventory', auth, inventoryRoutes);
app.use('/health', healthRoutes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
