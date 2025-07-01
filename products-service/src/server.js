const app = require('./app');
const sequelize = require('./database');
require('./models/product.model');

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Products service running on port ${PORT}`));
});
