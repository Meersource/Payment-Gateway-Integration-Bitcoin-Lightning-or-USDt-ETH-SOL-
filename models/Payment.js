
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "USD"
  },
  coinbaseChargeId: String,
  hostedUrl: String,
  status: {
    type: String,
    default: "pending"
  },
//   status: { type: String, enum: ['NEW', 'PENDING', 'COMPLETED', 'FAILED'], default: 'NEW' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
