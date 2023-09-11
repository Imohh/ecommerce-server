const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  unit_amount: {
    type: String,
    required: true,
  },
  paymentDescription: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
