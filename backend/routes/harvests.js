const express = require('express');
const router = express.Router();
const { createHarvest, getHarvests, getHarvest, updateHarvest, deleteHarvest } = require('../controllers/harvestController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createHarvest);
router.get('/', getHarvests);
router.get('/:id', getHarvest);
router.put('/:id', updateHarvest);
router.delete('/:id', deleteHarvest);

module.exports = router;
