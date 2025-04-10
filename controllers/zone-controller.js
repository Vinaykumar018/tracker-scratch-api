const Zone = require('../models/zoneSchema');

// Generate unique zone ID
const generateZoneId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return `ZONE-ERICK-${randomDigits}`;
};

// POST: Create a new Zone
exports.createZone = async (req, res) => {
  try {
    const {
      zone_name,
      status,
      zone_color,
      zone_name_abbr,
      zone_area_name,
      created_by,
    } = req.body;

    // Generate zone ID
    const zone_id = generateZoneId();

    // Create new zone
    const newZone = new Zone({
      zone_id,
      zone_name,
      status: status || 'active', // Default to active if not provided
      zone_color: zone_color || '#000000', // Default color if not provided
      zone_name_abbr,
      zone_area_name,
      created_by: created_by || 'admin', // Default to admin if not provided
    });

    // Save to database
    const savedZone = await newZone.save();

    res.status(200).json({
      message: 'Zone created successfully',
      data: savedZone,
      zone_id: zone_id,
    });
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({
      message: 'Failed to create zone',
      error: error.message,
    });
  }
};

exports.listZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      message: 'Zones fetched successfully',
      data: zones,
    });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({
      message: 'Failed to fetch zones',
      error: error.message,
    });
  }
};



exports.getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findOne({ _id: id });

    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.status(200).json({
      message: 'Zone fetched successfully',
      data: zone,
    });
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ message: 'Failed to fetch zone', error: error.message });
  }
};

exports.updateZoneById = async (req, res) => {
  try {
    console.log(" req.params is",req.params )
    console.log("req.body is",req.body)
    const { id } = req.params;
    const updateData = req.body;
   

    const updatedZone = await Zone.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!updatedZone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.status(200).json({
      message: 'Zone updated successfully',
      data: updatedZone,
    });
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ message: 'Failed to update zone', error: error.message });
  }
};

exports.deleteZoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedZone = await Zone.findOneAndDelete({ _id: id });

    if (!deletedZone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.status(200).json({
      message: 'Zone deleted successfully',
      data: deletedZone,
    });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ message: 'Failed to delete zone', error: error.message });
  }
};


exports.getActiveZoneList = async (req, res) => {
  try {
    const activeZones = await Zone.find({ status: 'active' }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Active zones fetched successfully',
      data: activeZones,
    });
  } catch (error) {
    console.error('Error fetching active zones:', error);
    res.status(500).json({
      message: 'Failed to fetch active zones',
      error: error.message,
    });
  }
};
