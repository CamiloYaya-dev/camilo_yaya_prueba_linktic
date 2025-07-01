const express = require('express');
const inventoryRoutes = require('./routes/inventory.routes');
const healthRoutes = require('./routes/health.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use('/inventory', inventoryRoutes);
app.use('/health', healthRoutes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;
