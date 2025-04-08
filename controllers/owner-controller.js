// const { v4: uuidv4 } = require("uuid");
// const Owner = require("../models/OwnerSchema");
// const Driver = require("../models/DriverSchema");

// exports.createOwner = async (req, res) => {

  
//   try {
//     const {
//       first_name,
//       last_name,
//       email,
//       gender,
//       phone,
//       aadhaar_no,
//       dob,
//       aadhaar_front_image,
//       aadhaar_back_image,
//       profile_image,
//       isdriver,
//       role,
//       address,
//       status,
//       created_by,
//       licenseNumber,
//       backgroundVerificationStatus,
//       dl_image,
//       dl_back_image,
//       driverId,
//     } = req.body;

//     // Basic required field validation
//     if (!first_name || !last_name || !email || !aadhaar_no || !phone) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const id = uuidv4();
//     const driver_uuid = driverId || uuidv4();

//     const ownerData = {
//       id,
//       userId: id,
//       first_name,
//       last_name,
//       email,
//       gender,
//       phone,
//       aadhaar_no,
//       dob,
//       aadhaar_front_image,
//       aadhaar_back_image,
//       profile_image,
//       isdriver,
//       role,
//       address,
//       status: status || "Pending",
//       created_by,
//       createdAt: new Date(),
//       driver_count: isdriver ? 2 : 0,
//       vehicle_count: 0,
//       requestStatus: false,
//       isUpdate: false,
//     };

//     if (isdriver) {
//       ownerData.licenseNumber = licenseNumber;
//       ownerData.backgroundVerificationStatus = backgroundVerificationStatus || "Pending";
//       ownerData.dl_image = dl_image;
//       ownerData.dl_back_image = dl_back_image;
//       ownerData.driverId = driver_uuid;
//     }

//     // Save to Owner schema
//     const newOwner = new Owner(ownerData);
//     await newOwner.save();

//     // Save to Driver schema if isdriver is true (without isdriver field)
//     if (isdriver) {
//       const { isdriver, ...restOwnerData } = ownerData;

//       const driverData = {
//         ...restOwnerData,
//         driverId: driver_uuid, // make sure it's in both
//       };

//       const newDriver = new Driver(driverData);
//       await newDriver.save();
//     }

//     res.status(201).json({ message: "Owner created successfully", data: newOwner });

//   } catch (err) {
//     console.error("Error creating owner:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const Owner = require("../models/OwnerSchema");
const Driver = require("../models/DriverSchema");
const path = require('path');
const fs = require('fs');
// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '..', 'public', 'uploads', 'owner_related_images');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Initialize Multer with configuration
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).fields([
  { name: 'aadhaar_front_image', maxCount: 1 },
  { name: 'aadhaar_back_image', maxCount: 1 },
  { name: 'profile_image', maxCount: 1 },
  { name: 'dl_image', maxCount: 1 },
  { name: 'dl_back_image', maxCount: 1 }
]);

exports.createOwner = async (req, res) => {
  // First handle the file upload
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: err.message });
    }

    try {
      // Now process the form data
      const {
        first_name,
        last_name,
        email,
        gender,
        phone,
        aadhaar_no,
        dob,
        isdriver,
        role,
        address,
        status,
        created_by,
        licenseNumber,
        backgroundVerificationStatus,
        driverId,
      } = req.body;

      // Get file paths from req.files (if they exist)
      const aadhaar_front_image = req.files?.aadhaar_front_image?.[0]?.path;
      const aadhaar_back_image = req.files?.aadhaar_back_image?.[0]?.path;
      const profile_image = req.files?.profile_image?.[0]?.path;
      const dl_image = req.files?.dl_image?.[0]?.path;
      const dl_back_image = req.files?.dl_back_image?.[0]?.path;

      // Basic required field validation
      if (!first_name || !last_name || !email || !aadhaar_no || !phone) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const id = uuidv4();
      const driver_uuid = driverId || uuidv4();

      const ownerData = {
        id,
        userId: id,
        first_name,
        last_name,
        email,
        gender,
        phone,
        aadhaar_no,
        dob,
        aadhaar_front_image,
        aadhaar_back_image,
        profile_image,
        isdriver,
        role,
        address,
        status: status || "Pending",
        created_by,
        createdAt: new Date(),
        driver_count: isdriver ? 2 : 0,
        vehicle_count: 0,
        requestStatus: false,
        isUpdate: false,
      };

      if (isdriver) {
        ownerData.licenseNumber = licenseNumber;
        ownerData.backgroundVerificationStatus = backgroundVerificationStatus || "Pending";
        ownerData.dl_image = dl_image;
        ownerData.dl_back_image = dl_back_image;
        ownerData.driverId = driver_uuid;
      }

      // Save to Owner schema
      const newOwner = new Owner(ownerData);
      await newOwner.save();

      // Save to Driver schema if isdriver is true (without isdriver field)
      if (isdriver) {
        const { isdriver, ...restOwnerData } = ownerData;

        const driverData = {
          ...restOwnerData,
          driverId: driver_uuid,
        };

        const newDriver = new Driver(driverData);
        await newDriver.save();
      }

      res.status(201).json({ message: "Owner created successfully", data: newOwner });

    } catch (err) {
      console.error("Error creating owner:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
};