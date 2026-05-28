const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Settlement must belong to a group']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who paid']
  },
  paidTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who received payment']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide settlement amount'],
    min: [0.01, 'Amount must be greater than 0']
  }
}, {
  timestamps: true
});

// Validate that paidBy and paidTo are different users
settlementSchema.pre('save', function(next) {
  if (this.paidBy.equals(this.paidTo)) {
    const error = new Error('Cannot settle with yourself');
    error.statusCode = 400;
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Settlement', settlementSchema);
