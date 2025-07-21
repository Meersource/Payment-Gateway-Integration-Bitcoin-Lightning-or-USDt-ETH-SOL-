const axios = require('axios');
const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlware/async');

//@desc    Create a new OpenNode charge
//@route   POST /api/create-payment
//@access   Private

exports.createPayment =asyncHandler(async (req, res) => {
    const { amount, currency } = req.body;
    const response = await axios.post(
      'https://dev-api.opennode.com/v1/charges',
      {
        amount,
        currency,
        description: `Payment from user ${req.user.id}`,
        callback_url: `https://d9d61a6816c5.ngrok-free.app/api/webhook/opennode`,
        auto_settle: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.OPENNODE_API_KEY
        }
      }
    );
    const charge = response.data.data;

    const payment = await Payment.create({
      user: req.user.id,
      amount,
      currency,
      chargeId: charge.id,
      hostedUrl: charge.hosted_checkout_url,
      status: charge.status || 'new'
    });
    res.status(201).json({ paymentUrl: charge.hosted_checkout_url, chargeId: charge.id });
});

//@desc    Webhook to receive OpenNode event
//@route   POST /api/webhook/opennode
//@access   Private

exports.handleOpenNodeWebhook =asyncHandler(async (req, res) => {
    const { id: chargeId, status } = req.body;

    if (!chargeId || !status) {
      return next(new ErrorResponse(`Invalid webhook payload`, 400))
    }
    const payment = await Payment.findOneAndUpdate(
      { chargeId: chargeId },
      {
        status: status.toUpperCase(),
        paidAt: status.toLowerCase() === 'paid' ? new Date() : undefined
      },
      { new: true }
    ).populate('user', 'email name');

    if (!payment) {
      console.warn(`Webhook received for unknown charge ID: ${chargeId}`);
      return next(new ErrorResponse(`Payment not found`, 404))
    }
    console.log(
      `Webhook: Payment status updated for user ${payment.user?.email} | Charge ID: ${chargeId} | New Status: ${status.toUpperCase()}`
    );
    res.status(200).send('Webhook processed');
});
/**
 * Get payment status
 */

//@desc   Get payment status
//@route   POST /api/payment-status/:id
//@access   Private

exports.getPaymentStatus =asyncHandler( async (req, res) => {

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return next(new ErrorResponse(`Payment not found`, 404))
    }
    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json({ success: true, payment });
  
});
