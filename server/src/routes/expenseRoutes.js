const express = require('express');
const router = express.Router();
const {
  createExpense,
  getGroupExpenses,
  getRecentExpenses,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createExpense);

router.route('/recent')
  .get(getRecentExpenses);

router.route('/group/:groupId')
  .get(getGroupExpenses);

router.route('/:id')
  .delete(deleteExpense);

module.exports = router;
