const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const Group = require('../models/Group');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Calculate pairwise balances from expenses and settlements
 * Returns object: { 'userId1_userId2': amount }
 * Positive amount means userId1 owes userId2
 */
const calculatePairwiseBalances = (expenses, settlements) => {
  const balances = {};

  // Helper to get consistent key for user pair
  const getKey = (user1, user2) => {
    const ids = [user1.toString(), user2.toString()].sort();
    return `${ids[0]}_${ids[1]}`;
  };

  // Helper to get direction multiplier
  const getDirection = (user1, user2) => {
    const ids = [user1.toString(), user2.toString()].sort();
    return user1.toString() === ids[0] ? 1 : -1;
  };

  // Process expenses
  for (const expense of expenses) {
    const paidBy = expense.paidBy._id || expense.paidBy;
    const splitAmount = expense.amount / expense.splitAmong.length;

    for (const user of expense.splitAmong) {
      const userId = user._id || user;
      
      // Skip if same user
      if (userId.toString() === paidBy.toString()) continue;

      const key = getKey(userId, paidBy);
      const direction = getDirection(userId, paidBy);
      
      // userId owes paidBy the splitAmount
      // If direction is 1, userId is first, so positive means userId owes second user
      // We want: userId owes paidBy, so if userId < paidBy, balance is positive
      if (!balances[key]) balances[key] = 0;
      balances[key] += splitAmount * direction;
    }
  }

  // Process settlements
  for (const settlement of settlements) {
    const paidBy = settlement.paidBy._id || settlement.paidBy;
    const paidTo = settlement.paidTo._id || settlement.paidTo;

    const key = getKey(paidBy, paidTo);
    const direction = getDirection(paidBy, paidTo);

    // paidBy paid paidTo, so paidBy's debt to paidTo decreases
    // If paidBy < paidTo: positive balance means paidBy owes paidTo
    // Payment reduces this, so subtract
    if (!balances[key]) balances[key] = 0;
    balances[key] -= settlement.amount * direction;
  }

  return balances;
};

/**
 * @desc    Get balances for a group
 * @route   GET /api/balances/group/:groupId
 * @access  Private
 */
const getGroupBalances = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId).populate('members', 'name email');

  if (!group) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  // Check if requester is a member
  if (!group.members.some(member => member._id.equals(req.user._id))) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group'
    });
  }

  // Get expenses and settlements
  const expenses = await Expense.find({ groupId: req.params.groupId });
  const settlements = await Settlement.find({ groupId: req.params.groupId });

  // Calculate pairwise balances
  const pairwiseBalances = calculatePairwiseBalances(expenses, settlements);

  // Format balances for response
  // For each pair, determine who owes whom
  const balances = [];
  const memberMap = {};
  group.members.forEach(m => {
    memberMap[m._id.toString()] = { _id: m._id, name: m.name, email: m.email };
  });

  for (const [key, amount] of Object.entries(pairwiseBalances)) {
    if (Math.abs(amount) < 0.01) continue; // Skip negligible amounts

    const [user1Id, user2Id] = key.split('_');
    
    if (amount > 0) {
      // user1 owes user2
      balances.push({
        from: memberMap[user1Id],
        to: memberMap[user2Id],
        amount: Math.round(amount * 100) / 100
      });
    } else {
      // user2 owes user1
      balances.push({
        from: memberMap[user2Id],
        to: memberMap[user1Id],
        amount: Math.round(Math.abs(amount) * 100) / 100
      });
    }
  }

  // Calculate summary for current user
  let totalOwed = 0; // What others owe me
  let totalOwing = 0; // What I owe others

  for (const balance of balances) {
    if (balance.from._id.equals(req.user._id)) {
      totalOwing += balance.amount;
    }
    if (balance.to._id.equals(req.user._id)) {
      totalOwed += balance.amount;
    }
  }

  res.json({
    success: true,
    data: {
      balances,
      summary: {
        totalOwed: Math.round(totalOwed * 100) / 100,
        totalOwing: Math.round(totalOwing * 100) / 100,
        netBalance: Math.round((totalOwed - totalOwing) * 100) / 100
      }
    }
  });
});

/**
 * @desc    Get global balances across all groups
 * @route   GET /api/balances/global
 * @access  Private
 */
const getGlobalBalances = asyncHandler(async (req, res) => {
  // Get user's groups
  const groups = await Group.find({ members: req.user._id }).populate('members', 'name email');
  const groupIds = groups.map(g => g._id);

  // Get all expenses and settlements from user's groups
  const expenses = await Expense.find({ groupId: { $in: groupIds } });
  const settlements = await Settlement.find({ groupId: { $in: groupIds } });

  // Calculate pairwise balances
  const pairwiseBalances = calculatePairwiseBalances(expenses, settlements);

  // Aggregate balances per user pair (across groups)
  const userBalances = {};
  const userMap = {};
  
  // Build user map from all groups
  groups.forEach(group => {
    group.members.forEach(m => {
      userMap[m._id.toString()] = { _id: m._id, name: m.name, email: m.email };
    });
  });

  for (const [key, amount] of Object.entries(pairwiseBalances)) {
    if (Math.abs(amount) < 0.01) continue;

    const [user1Id, user2Id] = key.split('_');
    
    // Only include balances involving current user
    if (user1Id !== req.user._id.toString() && user2Id !== req.user._id.toString()) {
      continue;
    }

    const otherUserId = user1Id === req.user._id.toString() ? user2Id : user1Id;
    
    if (!userBalances[otherUserId]) {
      userBalances[otherUserId] = 0;
    }

    if (amount > 0) {
      // user1 owes user2
      if (user1Id === req.user._id.toString()) {
        userBalances[otherUserId] -= amount; // I owe them
      } else {
        userBalances[otherUserId] += amount; // They owe me
      }
    } else {
      // user2 owes user1
      if (user2Id === req.user._id.toString()) {
        userBalances[otherUserId] += Math.abs(amount); // They owe me
      } else {
        userBalances[otherUserId] -= Math.abs(amount); // I owe them
      }
    }
  }

  // Format response
  const balances = [];
  let totalOwed = 0;
  let totalOwing = 0;

  for (const [userId, amount] of Object.entries(userBalances)) {
    if (Math.abs(amount) < 0.01) continue;

    if (amount > 0) {
      // They owe me
      totalOwed += amount;
      balances.push({
        user: userMap[userId],
        amount: Math.round(amount * 100) / 100,
        type: 'owed' // They owe me
      });
    } else {
      // I owe them
      totalOwing += Math.abs(amount);
      balances.push({
        user: userMap[userId],
        amount: Math.round(Math.abs(amount) * 100) / 100,
        type: 'owing' // I owe them
      });
    }
  }

  res.json({
    success: true,
    data: {
      balances,
      summary: {
        totalOwed: Math.round(totalOwed * 100) / 100,
        totalOwing: Math.round(totalOwing * 100) / 100,
        netBalance: Math.round((totalOwed - totalOwing) * 100) / 100
      }
    }
  });
});

module.exports = {
  getGroupBalances,
  getGlobalBalances
};
