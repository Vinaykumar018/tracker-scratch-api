const express = require('express');
const router = express.Router();
const { signin, authenticateToken } = require('../middleware/authController');

const { createOwner } = require('../controllers/owner-controller');
// Route: POST /api/auth/signin

const {
  registerEmployee,
  loginEmployee,
  verifyOTP,
} = require('../controllers/employee-controller');



router.post('/auth/signin', signin);
router.post('/owner/register', authenticateToken, createOwner);
router.post("/employee/register",authenticateToken, registerEmployee);
router.post("/employee/login",authenticateToken, loginEmployee);
router.post("/employee/verify/login",authenticateToken, verifyOTP);


module.exports = router;
