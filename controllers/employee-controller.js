const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/EmployeeSchema");

// ---------------- REGISTER ----------------


const generateLoginId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `KNN-ERICK${randomDigits}`;
};
const otpStore = new Map(); // phone -> OTP

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);


exports.registerEmployee = async (req, res) => {

  
  try {
    const {
      first_name,
      last_name,
      phone,
      email,
      gender,
      dob,
      address,
      pincode,
      password,
      role,
      created_by,
    } = req.body;


    const loginId = generateLoginId();

    if (!first_name || !last_name || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Employee.findOne({ loginId });
    if (existing) {
      return res.status(400).json({ message: "Login ID already exists" });
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      id,
      loginId,
      first_name,
      last_name,
      phone,
      email,
      gender,
      dob,
      address,
      pincode,
      password: hashedPassword,
      role,
      created_by,
      status: "Active",
      createdAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    await employee.save();

    res.status(201).json({ message: "Employee registered successfully", data: employee });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// You can keep OTP in memory or store it temporarily in DB; here we're using in-memory


exports.loginEmployee = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await Employee.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store the OTP temporarily (for example purpose, 5 minutes expiration can be implemented)
    otpStore.set(phone, otp);

    // Send OTP (for now return in response)
    res.status(200).json({
      message: "OTP sent successfully",
      phone,
      otp, // for testing, remove in production
    });

  } catch (err) {
    console.error("OTP generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  const savedOtp = otpStore.get(phone);
  if (savedOtp && parseInt(otp) === savedOtp) {
    otpStore.delete(phone); // OTP used, so delete

    const user = await Employee.findOne({ phone });
    return res.status(200).json({ message: "OTP verified, login successful", data: user });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};






// ---------------- LOGIN ----------------
// exports.loginEmployee = async (req, res) => {
//   try {
//     const { loginId, password } = req.body;

//     if (!loginId || !password) {
//       return res.status(400).json({ message: "Login ID and password required" });
//     }

//     const user = await Employee.findOne({ loginId });
//     if (!user) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     user.jwt_token = token;
//     await user.save();

//     res.status(200).json({ message: "Login successful", token, data: user });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
