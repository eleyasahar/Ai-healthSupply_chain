const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  phc_id: { type: String, required: true },
  item_id: { type: String, required: true },
  item_name: String,
  current_stock: Number,
  daily_consumption_avg: Number,
  minimum_threshold: Number,
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);