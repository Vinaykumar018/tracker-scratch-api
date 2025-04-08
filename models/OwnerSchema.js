const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  id: { type: String },
  userId: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  gender: { type: String },
  phone: { type: String },
  aadhaar_no: { type: String },
  dob: { type: Date },
  aadhaar_front_image: { type: String },
  aadhaar_back_image: { type: String },
  profile_image: { type: String },
  isdriver: { type: Boolean, default: false },
  role: { type: String, enum: ["owner", "driver", "both"] },
  address: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  created_by: { type: String },

  // Optional driver fields
  licenseNumber: { type: String },
  backgroundVerificationStatus: { type: String },
  dl_image: { type: String },
  dl_back_image: { type: String },
  driverId: { type: String },

  driver_count: { type: Number, default: 0 },
  vehicle_count: { type: Number, default: 0 },
  requestStatus: { type: Boolean, default: false },
  isUpdate: { type: Boolean, default: false },
});

// Remove driver-related fields if not a driver
ownerSchema.pre("save", function (next) {
  if (!this.isdriver) {
    this.licenseNumber = undefined;
    this.backgroundVerificationStatus = undefined;
    this.dl_image = undefined;
    this.dl_back_image = undefined;
    this.driverId = undefined;
  }
  next();
});

const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;
