const Settlement = require('../models/Settlement');
const Group = require('../models/Group');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create settlement
 * @route   POST /api/settlements
 * @access  Private
 */
const createSettlement = asyncHandler(async (req, res) => {
  const { groupId, paidTo, amount } = req.body;

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

  // Validate paidTo is a group member
  if (!group.members.some(id => id.equals(paidTo))) {
    return res.status(400).json({
      success: false,
      message: 'Recipient must be a group member'
    });
  }

  // Cannot settle with yourself
  if (req.user._id.equals(paidTo)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot settle with yourself'
    });
  }

  // Create settlement (current user is paying)
  const settlement = await Settlement.create({
    groupId,
    paidBy: req.user._id,
    paidTo,
    amount
  });

  // Populate for response
  await settlement.populate('paidBy', 'name email');
  await settlement.populate('paidTo', 'name email');
  await settlement.populate('groupId', 'name');

  res.status(201).json({
    success: true,
    message: 'Settlement recorded successfully',
    data: { settlement }
  });
});

/**
 * @desc    Get settlements for a group
 * @route   GET /api/settlements/group/:groupId
 * @access  Private
 */
const getGroupSettlements = asyncHandler(async (req, res) => {
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

  const settlements = await Settlement.find({ groupId: req.params.groupId })
    .populate('paidBy', 'name email')
    .populate('paidTo', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: settlements.length,
    data: { settlements }
  });
});

/**
 * @desc    Get settlement history for current user
 * @route   GET /api/settlements/history
 * @access  Private
 */
const getSettlementHistory = asyncHandler(async (req, res) => {
  const settlements = await Settlement.find({
    $or: [
      { paidBy: req.user._id },
      { paidTo: req.user._id }
    ]
  })
    .populate('paidBy', 'name email')
    .populate('paidTo', 'name email')
    .populate('groupId', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: settlements.length,
    data: { settlements }
  });
});

module.exports = {
  createSettlement,
  getGroupSettlements,
  getSettlementHistory
};
