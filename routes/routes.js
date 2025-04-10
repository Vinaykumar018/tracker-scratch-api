const express = require('express');
const router = express.Router();
const { signin, authenticateToken } = require('../middleware/authController');

const { createOwner ,getAllOwners ,getOwnerById,updateOwnerById  } = require('../controllers/owner-controller');
const { createZone,
  listZones,
  getZoneById,
  updateZoneById,
  deleteZoneById,
  getActiveZoneList}=require("../controllers/zone-controller")
// Route: POST /api/auth/signin

const {
  registerEmployee,
  loginEmployee,
  verifyOTP,
} = require('../controllers/employee-controller');


                             // AUTH 
router.post('/auth/signin', signin);

                             //OWNER 
router.post('/owner/register', authenticateToken, createOwner);
router.get('/owner/list', authenticateToken, getAllOwners);
router.get('/owner/:id', authenticateToken,getOwnerById);
// router.post('/owner/update/:id', authenticateToken, updateOwnerById );

                           //LOGIN 
router.post("/employee/register",authenticateToken, registerEmployee);
router.post("/employee/login",authenticateToken, loginEmployee);
router.post("/employee/verify/login",authenticateToken, verifyOTP);


                          // ZONE
router.post("/create/zone",authenticateToken,createZone)
router.get("/get/zone",authenticateToken,listZones)
router.get("/get/zone/:id",authenticateToken,getZoneById)
router.put("/update/zone/:id",authenticateToken,updateZoneById)
router.delete("/delete/zone/:id",authenticateToken,deleteZoneById)
router.get("/get/active/zone",authenticateToken,getActiveZoneList)



module.exports = router;
