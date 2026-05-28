const express = require('express');
const router = express.Router();
const {
  getGroupBalances,
  getGlobalBalances
} = require('../controllers/balanceController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/global')
  .get(getGlobalBalances);

router.route('/group/:groupId')
  .get(getGroupBalances);

module.exports = router;
