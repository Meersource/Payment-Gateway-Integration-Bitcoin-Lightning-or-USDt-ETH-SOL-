require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

connectDB();
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const server = app.listen(PORT,console.log(`server running on port ${PORT}`));
// Handle unhandled promise rejections
process.on("unhandledRejection", (err, Promise) => {
  console.log(`Error: ${err.message}`.red);

  //Close server and exit process

  server.close(() => process.exit(1));
});