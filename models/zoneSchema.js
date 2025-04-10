// models/zoneSchema.js
const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  zone_id: {
    type: String,
    required: true,
    unique: true,
  },
  zone_name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  zone_color: {
    type: String,
    default: '#000000',
  },
  zone_name_abbr: {
    type: String,
  },
  zone_area_name: {
    type: String,
  },
  created_by: {
    type: String,
    required: true,
    default: 'admin',
  },
  createdAt: { type: Date, default: Date.now },
});

// Export the model properly
module.exports = mongoose.model("Zone", zoneSchema);