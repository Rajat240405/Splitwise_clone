const express = require('express');
const router = express.Router();
const {
  createGroup,
  getMyGroups,
  getGroup,
  addMember,
  removeMember
} = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .post(createGroup)
  .get(getMyGroups);

router.route('/:id')
  .get(getGroup);

router.route('/:id/members')
  .post(addMember);

router.route('/:id/members/:userId')
  .delete(removeMember);

module.exports = router;
