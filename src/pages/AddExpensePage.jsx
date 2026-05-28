import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupsAPI, expensesAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AddExpensePage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [group, setGroup] = useState(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitAmong: []
  });

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const response = await groupsAPI.getOne(groupId);
      const groupData = response.data.data.group;
      setGroup(groupData);
      
      // Set defaults: current user paid, split among all
      setFormData(prev => ({
        ...prev,
        paidBy: user?._id,
        splitAmong: groupData.members?.map(m => m._id) || []
      }));
    } catch (error) {
      console.error('Error fetching group:', error);
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSplitToggle = (memberId) => {
    setFormData(prev => {
      const isSelected = prev.splitAmong.includes(memberId);
      return {
        ...prev,
        splitAmong: isSelected
          ? prev.splitAmong.filter(id => id !== memberId)
          : [...prev.splitAmong, memberId]
      };
    });
    if (error) setError('');
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      splitAmong: group?.members?.map(m => m._id) || []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (formData.splitAmong.length === 0) {
      setError('Please select at least one person to split with');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await expensesAPI.create({
        groupId,
        description: formData.description.trim(),
        amount,
        paidBy: formData.paidBy,
        splitAmong: formData.splitAmong
      });
      
      navigate(`/groups/${groupId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Calculate split preview
  const amount = parseFloat(formData.amount) || 0;
  const splitCount = formData.splitAmong.length;
  const splitAmount = splitCount > 0 ? amount / splitCount : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to={`/groups/${groupId}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
          <p className="text-gray-500 text-sm">{group?.name}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Dinner at restaurant"
            required
          />

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid by
            </label>
            <div className="grid grid-cols-2 gap-2">
              {group?.members?.map((member) => (
                <button
                  key={member._id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paidBy: member._id }))}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    formData.paidBy === member._id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Avatar name={member.name} size="sm" />
                  <span className="text-sm truncate">
                    {member._id === user?._id ? 'You' : member.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Split Among */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Split among
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-teal-600 hover:text-teal-700"
              >
                Select all
              </button>
            </div>
            <div className="space-y-2">
              {group?.members?.map((member) => (
                <label
                  key={member._id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.splitAmong.includes(member._id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.splitAmong.includes(member._id)}
                    onChange={() => handleSplitToggle(member._id)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <Avatar name={member.name} size="sm" />
                  <span className="flex-1 text-sm">
                    {member._id === user?._id ? 'You' : member.name}
                  </span>
                  {formData.splitAmong.includes(member._id) && splitAmount > 0 && (
                    <span className="text-sm text-gray-500">
                      ₹{splitAmount.toFixed(2)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Split Preview */}
          {amount > 0 && splitCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 text-center">
                ₹{amount.toFixed(2)} ÷ {splitCount} = 
                <span className="font-semibold text-gray-900">
                  {' '}₹{splitAmount.toFixed(2)} per person
                </span>
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/groups/${groupId}`)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              className="flex-1"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
