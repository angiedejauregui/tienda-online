const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const productsRoute = require('./routes/products.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const orderRoute = require('./routes/order.route');
const cartRoutes = require('./routes/cart.route');


const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/orders', orderRoute);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
