require('dotenv').config({ path: "./config/config.env" });
const express = require('express');
const bodyParser = require('body-parser')
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

connectDB();
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,console.log(`server running on port ${PORT}`));
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error: ${err.message}`.red);

  //Close server and exit process

  server.close(() => process.exit(1));
});