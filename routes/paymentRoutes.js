const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require("../middlware/auth");

router.post("/create-payment", protect, paymentController.createPayment);
router.get('/payment-status/:id',protect, paymentController.getPaymentStatus);
router.post('/webhook/opennode', paymentController.handleOpenNodeWebhook);

module.exports = router;
