const Farmer = require('../models/Farmer');

// GET /api/farmers/profile
const getProfile = async (req, res) => {
  res.json(req.farmer);
};

// PUT /api/farmers/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, location, village, district, state, preferredLanguage } = req.body;
    const updated = await Farmer.findByIdAndUpdate(
      req.farmer._id,
      { name, location, village, district, state, preferredLanguage },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
