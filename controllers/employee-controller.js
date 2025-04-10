const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/EmployeeSchema');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(
      __dirname,
      '..',
      'public',
      'uploads',
      'employee_related_images',
    );

    // Create directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// Initialize Multer with configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: 'aadhaar_front_image', maxCount: 1 },
  { name: 'employee_photo', maxCount: 1 },
  { name: 'employee_id_card_photo', maxCount: 1 },
]);

// ---------------- REGISTER ----------------

const generateLoginId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `KNN-ERICK${randomDigits}`;
};
const otpStore = new Map(); // phone -> OTP

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

exports.registerEmployee = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: err.message });
    }

    try {
      const {
        first_name,
        last_name,
        phone,
        email,
        gender,
        dob,
        address,
        city,
        state,
        pincode,
        password,
        role,
        created_by,
        zone_id,
      } = req.body;

      const loginId = generateLoginId();

      if (!first_name || !last_name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existing = await Employee.findOne({ loginId });
      if (existing) {
        return res.status(400).json({ message: 'Login ID already exists' });
      }

      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Handle file paths
      const employee_photo = req.files['employee_photo']
        ? path.join(
            'uploads',
            'employee_related_images',
            req.files['employee_photo'][0].filename,
          )
        : null;

      const employee_id_card_photo = req.files['employee_id_card_photo']
        ? path.join(
            'uploads',
            'employee_related_images',
            req.files['employee_id_card_photo'][0].filename,
          )
        : null;

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
        city,
        state,
        pincode,
        password: hashedPassword,
        role,
        created_by,
        zone_id,
        employee_photo,
        employee_id_card_photo,
        status: 'Active',
        createdAt: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      });

      await employee.save();

      res
        .status(200)
        .json({ message: 'Employee registered successfully', data: employee });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Server error', err });
    }
  });
};

// You can keep OTP in memory or store it temporarily in DB; here we're using in-memory

exports.loginEmployee = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await Employee.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store the OTP temporarily (for example purpose, 5 minutes expiration can be implemented)
    otpStore.set(phone, otp);

    // Send OTP (for now return in response)
    res.status(200).json({
      message: 'OTP sent successfully',
      phone,
      otp, // for testing, remove in production
    });
  } catch (err) {
    console.error('OTP generation error:', err);
    res.status(500).json({ message: 'Server error', err });
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  const savedOtp = otpStore.get(phone);
  if (savedOtp && parseInt(otp) === savedOtp) {
    otpStore.delete(phone); // OTP used, so delete

    const user = await Employee.findOne({ phone });
    return res
      .status(200)
      .json({ message: 'OTP verified, login successful', data: user });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};

