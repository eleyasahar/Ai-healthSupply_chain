const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  source_phc_id: String,
  target_phc_id: String,
  item_id: String,
  quantity: Number,
  status: { type: String, enum: ['RECOMMENDED', 'IN_TRANSIT', 'COMPLETED'], default: 'RECOMMENDED' },
  reason: String
});

module.exports = mongoose.model('Order', orderSchema);