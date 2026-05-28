const Expense = require('../models/Expense');
const Group = require('../models/Group');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const createExpense = asyncHandler(async (req, res) => {
  const { groupId, description, amount, paidBy, splitAmong } = req.body;

  // Validate group exists
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  // Check if requester is a member
  if (!group.members.some(id => id.equals(req.user._id))) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group'
    });
  }

  // Validate paidBy is a group member
  if (!group.members.some(id => id.equals(paidBy))) {
    return res.status(400).json({
      success: false,
      message: 'Payer must be a group member'
    });
  }

  // Validate all splitAmong users are group members
  for (const userId of splitAmong) {
    if (!group.members.some(id => id.equals(userId))) {
      return res.status(400).json({
        success: false,
        message: 'All users in split must be group members'
      });
    }
  }

  // Create expense
  const expense = await Expense.create({
    groupId,
    description,
    amount,
    paidBy,
    splitAmong,
    createdBy: req.user._id
  });

  // Populate for response
  await expense.populate('paidBy', 'name email');
  await expense.populate('splitAmong', 'name email');
  await expense.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Expense added successfully',
    data: { expense }
  });
});

/**
 * @desc    Get expenses for a group
 * @route   GET /api/expenses/group/:groupId
 * @access  Private
 */
const getGroupExpenses = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId);

  if (!group) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  // Check if requester is a member
  if (!group.members.some(id => id.equals(req.user._id))) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group'
    });
  }

  const expenses = await Expense.find({ groupId: req.params.groupId })
    .populate('paidBy', 'name email')
    .populate('splitAmong', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: expenses.length,
    data: { expenses }
  });
});

/**
 * @desc    Get recent expenses for current user (across all groups)
 * @route   GET /api/expenses/recent
 * @access  Private
 */
const getRecentExpenses = asyncHandler(async (req, res) => {
  // Get user's groups
  const groups = await Group.find({ members: req.user._id }).select('_id');
  const groupIds = groups.map(g => g._id);

  // Get recent expenses from those groups
  const expenses = await Expense.find({ groupId: { $in: groupIds } })
    .populate('paidBy', 'name email')
    .populate('splitAmong', 'name email')
    .populate('groupId', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    success: true,
    count: expenses.length,
    data: { expenses }
  });
});

/**
 * @desc    Delete expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found'
    });
  }

  // Check if user is in the group
  const group = await Group.findById(expense.groupId);
  if (!group.members.some(id => id.equals(req.user._id))) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group'
    });
  }

  await expense.deleteOne();

  res.json({
    success: true,
    message: 'Expense deleted successfully'
  });
});

module.exports = {
  createExpense,
  getGroupExpenses,
  getRecentExpenses,
  deleteExpense
};
