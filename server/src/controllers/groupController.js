const Group = require('../models/Group');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Create new group
 * @route   POST /api/groups
 * @access  Private
 */
const createGroup = asyncHandler(async (req, res) => {
  const { name, memberEmails } = req.body;

  // Start with creator as member
  const members = [req.user._id];

  // If member emails provided, validate and add them
  if (memberEmails && memberEmails.length > 0) {
    for (const email of memberEmails) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: `User with email "${email}" not found. They must register first.`
        });
      }
      // Avoid duplicates
      if (!members.some(id => id.equals(user._id))) {
        members.push(user._id);
      }
    }
  }

  const group = await Group.create({
    name,
    members,
    createdBy: req.user._id
  });

  // Populate members for response
  await group.populate('members', 'name email');
  await group.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Group created successfully',
    data: { group }
  });
});

/**
 * @desc    Get all groups for current user
 * @route   GET /api/groups
 * @access  Private
 */
const getMyGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user._id })
    .populate('members', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: groups.length,
    data: { groups }
  });
});

/**
 * @desc    Get single group by ID
 * @route   GET /api/groups/:id
 * @access  Private
 */
const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate('members', 'name email')
    .populate('createdBy', 'name email');

  if (!group) {
    return res.status(404).json({
      success: false,
      message: 'Group not found'
    });
  }

  // Check if user is a member
  if (!group.members.some(member => member._id.equals(req.user._id))) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this group'
    });
  }

  res.json({
    success: true,
    data: { group }
  });
});

/**
 * @desc    Add member to group by email
 * @route   POST /api/groups/:id/members
 * @access  Private
 */
const addMember = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const group = await Group.findById(req.params.id);

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

  // Find user by email
  const userToAdd = await User.findOne({ email: email.toLowerCase() });

  if (!userToAdd) {
    return res.status(400).json({
      success: false,
      message: `User with email "${email}" not found. They must register first.`
    });
  }

  // Check if already a member
  if (group.members.some(id => id.equals(userToAdd._id))) {
    return res.status(400).json({
      success: false,
      message: 'User is already a member of this group'
    });
  }

  // Add member
  group.members.push(userToAdd._id);
  await group.save();

  // Populate for response
  await group.populate('members', 'name email');
  await group.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: `${userToAdd.name} added to group`,
    data: { group }
  });
});

/**
 * @desc    Remove member from group
 * @route   DELETE /api/groups/:id/members/:userId
 * @access  Private
 */
const removeMember = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);

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

  // Cannot remove the creator
  if (group.createdBy.equals(req.params.userId)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot remove the group creator'
    });
  }

  // Remove member
  group.members = group.members.filter(id => !id.equals(req.params.userId));
  await group.save();

  // Populate for response
  await group.populate('members', 'name email');
  await group.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Member removed from group',
    data: { group }
  });
});

module.exports = {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  removeMember
};
