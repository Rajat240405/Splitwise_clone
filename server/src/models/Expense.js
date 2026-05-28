const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: [true, 'Expense must belong to a group']
  },
  description: {
    type: String,
    required: [true, 'Please provide expense description'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide expense amount'],
    min: [0.01, 'Amount must be greater than 0']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify who paid']
  },
  splitAmong: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure paidBy is always in splitAmong
expenseSchema.pre('save', function(next) {
  if (!this.splitAmong.some(id => id.equals(this.paidBy))) {
    this.splitAmong.push(this.paidBy);
  }
  next();
});

// Virtual for split amount per person
expenseSchema.virtual('splitAmount').get(function() {
  return this.amount / this.splitAmong.length;
});

// Include virtuals in JSON output
expenseSchema.set('toJSON', { virtuals: true });
expenseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Expense', expenseSchema);
