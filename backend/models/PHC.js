const mongoose = require('mongoose');

const phcSchema = new mongoose.Schema({
  phc_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  district_id: String,
  state: String,
  capacity: { total_beds: Number, occupied_beds: Number },
  personnel: { doctors_present: Number, nurses_present: Number },
  coordinates: { lat: Number, lng: Number }
});

module.exports = mongoose.model('PHC', phcSchema);