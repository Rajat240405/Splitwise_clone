import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupsAPI, balancesAPI, settlementsAPI } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function SettleUpPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [group, setGroup] = useState(null);
  const [balances, setBalances] = useState([]);
  
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupRes, balancesRes] = await Promise.all([
        groupsAPI.getOne(groupId),
        balancesAPI.getByGroup(groupId)
      ]);
      
      setGroup(groupRes.data.data.group);
      
      // Get balances where current user owes someone
      const userOwes = balancesRes.data.data.balances.filter(
        b => b.from?._id === user?._id
      );
      setBalances(userOwes);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      navigate('/groups');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPerson = (balance) => {
    setSelectedPerson(balance.to);
    setAmount(balance.amount.toString());
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await settlementsAPI.create({
        groupId,
        paidTo: selectedPerson._id,
        amount: amountNum
      });
      
      setSuccess(`Payment of ₹${amountNum.toFixed(2)} to ${selectedPerson.name} recorded!`);
      setSelectedPerson(null);
      setAmount('');
      
      // Refresh balances
      await fetchData();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record settlement');
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
          <h1 className="text-2xl font-bold text-gray-900">Settle Up</h1>
          <p className="text-gray-500 text-sm">{group?.name}</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {/* No balances */}
      {balances.length === 0 && !selectedPerson ? (
        <Card>
          <EmptyState
            icon="✨"
            title="You're all settled up!"
            description="You don't owe anyone in this group"
            action={
              <Link to={`/groups/${groupId}`}>
                <Button size="sm">Back to Group</Button>
              </Link>
            }
          />
        </Card>
      ) : !selectedPerson ? (
        // Select person to settle with
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">You owe</h2>
          <div className="space-y-3">
            {balances.map((balance, index) => (
              <button
                key={index}
                onClick={() => handleSelectPerson(balance)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={balance.to?.name} />
                  <span className="font-medium text-gray-900">{balance.to?.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">{formatCurrency(balance.amount)}</p>
                  <p className="text-xs text-gray-500">Tap to settle</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      ) : (
        // Settlement form
        <Card>
          <div className="text-center mb-6">
            <Avatar name={selectedPerson.name} size="lg" className="mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900">
              Settle with {selectedPerson.name}
            </h2>
            <p className="text-sm text-gray-500">
              Record your payment
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-3 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                You are recording a payment of{' '}
                <span className="font-semibold text-gray-900">
                  ₹{parseFloat(amount || 0).toFixed(2)}
                </span>
                {' '}to{' '}
                <span className="font-semibold text-gray-900">
                  {selectedPerson.name}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSelectedPerson(null);
                  setAmount('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={submitting}
                className="flex-1"
              >
                Record Payment
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
