const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  loginId: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: String, required: true , unique: true},
  email: { type: String, required: true, unique: true },
  gender: { type: String },
  dob: { type: Date },
  address: { type: String },
  city: { type: String },
  state : { type: String },
  employee_photo: { type: String },
  employee_id_card_photo:{ type: String },
  pincode: { type: String, default: null },
  password: { type: String, required: true },
  jwt_token: { type: String },
  role: { type: String },
  zone_id: { type: String, default: null },
  creator_id: { type: String, default: null },
  created_by: { type: String },
  status: { type: String, default: "Active" },
  
  createdAt: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", EmployeeSchema);

//city ,state ,zone 