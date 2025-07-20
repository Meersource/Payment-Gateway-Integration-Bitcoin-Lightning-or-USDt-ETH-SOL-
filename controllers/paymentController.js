const axios = require('axios');
const Payment = require('../models/Payment');
const { mapCoinbaseEventToStatus } = require('../utils/EventStatus');

/**
 * Create a new Coinbase charge
 */

exports.createPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const user = req.user;

    const response = await axios.post(
      "https://api.commerce.coinbase.com/charges",
      {
        name: "Product Purchase",
        description: `Payment by user ${user.email}`,
        local_price: {
          amount,
          currency
        },
        pricing_type: "fixed_price",
        metadata: {
          userId: user._id.toString(),
          email: user.email
        },
        redirect_url: "https://www.google.com/",
        cancel_url: "https://yourdomain.com/payment-cancel"
      },
      {
        headers: {
          "X-CC-Api-Key": process.env.COINBASE_API_KEY,
          "X-CC-Version": "2018-03-22",
          "Content-Type": "application/json"
        }
      }
    );

    const charge = response.data.data;

    // Save payment info to DB
    const payment = new Payment({
      user: user._id,
      amount,
      currency,
      coinbaseChargeId: charge.id,
      hostedUrl: charge.hosted_url,
      status: "pending"
    });

    await payment.save();

    res.status(200).json({ success:true,url: charge.hosted_url, paymentId: payment._id });
  } catch (error) {
    console.error("Create Payment Error:", error.message);
    res.status(500).json({ message: "Payment creation failed" });
  }
};

//////////////////
// exports.createPayment = async (req, res) => {
//   try {
//     const { amount, currency } = req.body;

//     const chargeData = {
//       name: 'Crypto Payment',
//       description: 'Payment for subscription or product',
//       local_price: { amount, currency },
//       pricing_type: 'fixed_price',
//       metadata: { customer_id: 'test123' },
//        organization_name: 'Meer Hamza'
//     };

//     const response = await axios.post('https://api.commerce.coinbase.com/charges', chargeData, {
//       headers: {
//         'X-CC-Api-Key': process.env.COINBASE_API_KEY,
//         'X-CC-Version': '2018-03-22',
//         'Content-Type': 'application/json',
//       },
//     });
//     const { id, hosted_url } = response.data.data;
//     const payment = await Payment.create({
//       chargeId: id,
//       hostedUrl: hosted_url,
//       amount,
//       currency,
//     });

//     res.status(200).json({ success: true, hostedUrl: hosted_url, paymentId: payment._id });
//   } catch (err) {
//     console.error('Create Payment Error:', err.message);
//     res.status(500).json({ error: 'Payment creation failed' });
//   }
// };

/**
 * Webhook to receive Coinbase event
 */
exports.handleWebhook = async (req, res) => {
    // console.log("web hook triggered")

  try {
    const event = req.body.event;
    const chargeId = event.data.id;
const status = await mapCoinbaseEventToStatus(event)
console.log("status", status)
console.log("event", event)
    // const status = event.type.includes('charge:created') ? 'COMPLETED' :  event.type.includes('charge:confirmed') ? "Confirmed" : event.type.includes('charge:failed') ? 'FAILED' : 'PENDING';
// console.log("web hook triggered", event)
    await Payment.findOneAndUpdate({ coinbaseChargeId:chargeId }, { status: event.type }, { new: true });
    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send('Webhook processing failed');
  }
};

/**
 * Get payment status
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.status(200).json(payment);
  } catch (err) {
    console.error('Get Status Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
};