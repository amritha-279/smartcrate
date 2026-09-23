const express = require('express');
const router = express.Router();
const { submitFeedback, getMyFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', submitFeedback);
router.get('/', getMyFeedback);

module.exports = router;
