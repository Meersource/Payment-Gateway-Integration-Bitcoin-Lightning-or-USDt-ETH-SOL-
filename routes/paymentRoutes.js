const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

const { protect } = require("../middlware/auth");

router.post("/create-payment", protect, paymentController.createPayment);

// router.post('/create-payment', paymentController.createPayment);
router.post('/webhook', express.json({ type: '*/*' }), paymentController.handleWebhook);
router.get('/payment-status/:id', paymentController.getPaymentStatus);

module.exports = router;
