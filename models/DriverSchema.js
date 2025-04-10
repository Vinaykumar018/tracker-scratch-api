const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  id: { type: String, required: true }, // same as userId
  userId: { type: String, required: true },

  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, enum: ['M', 'F', 'O'], required: true },
  phone: { type: String, required: true },
  aadhaar_no: { type: String, required: true },
  dob: { type: Date, required: true },

  aadhaar_front_image: { type: String, required: true },
  aadhaar_back_image: { type: String, required: true },
  profile_image: { type: String },

  isdriver: { type: Boolean, default: true }, // always true for this schema
  role: { type: String, enum: ['owner', 'driver', 'both'], default: 'driver' },

  address: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  created_by: { type: String },

  licenseNumber: { type: String, required: true },
  backgroundVerificationStatus: { type: String, default: 'Pending' },
  dl_image: { type: String, required: true },
  dl_back_image: { type: String, required: true },
  driverId: { type: String, required: true },

  driver_count: { type: Number, default: 0 },
});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
