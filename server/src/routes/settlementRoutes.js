const express = require('express');
const router = express.Router();
const {
  createSettlement,
  getGroupSettlements,
  getSettlementHistory
} = require('../controllers/settlementController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createSettlement);

router.route('/history')
  .get(getSettlementHistory);

router.route('/group/:groupId')
  .get(getGroupSettlements);

module.exports = router;
