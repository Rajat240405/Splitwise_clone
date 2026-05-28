import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { groupsAPI, expensesAPI, balancesAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function GroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  
  // Add member modal
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [memberError, setMemberError] = useState('');

  useEffect(() => {
    fetchGroupData();
  }, [id]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupRes, expensesRes, balancesRes] = await Promise.all([
        groupsAPI.getOne(id),
        expensesAPI.getByGroup(id),
        balancesAPI.getByGroup(id)
      ]);
      
      setGroup(groupRes.data.data.group);
      setExpenses(expensesRes.data.data.expenses);
      setBalances(balancesRes.data.data);
    } catch (error) {
      console.error('Error fetching group:', error);
      if (error.response?.status === 404) {
        navigate('/groups');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim()) return;

    try {
      setAddingMember(true);
      setMemberError('');
      await groupsAPI.addMember(id, memberEmail.trim());
      await fetchGroupData();
      setShowAddMember(false);
      setMemberEmail('');
    } catch (error) {
      setMemberError(error.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expensesAPI.delete(expenseId);
      setExpenses(prev => prev.filter(e => e._id !== expenseId));
      // Refresh balances
      const balancesRes = await balancesAPI.getByGroup(id);
      setBalances(balancesRes.data.data);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading group..." />
      </div>
    );
  }

  if (!group) {
    return (
      <EmptyState
        icon="❌"
        title="Group not found"
        action={
          <Link to="/groups">
            <Button>Back to Groups</Button>
          </Link>
        }
      />
    );
  }

  const summary = balances?.summary || { totalOwed: 0, totalOwing: 0, netBalance: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/groups"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-500 text-sm">
              {group.members?.length} members
            </p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="text-center">
          <p className="text-teal-100 text-sm mb-1">Your Balance in this Group</p>
          <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-white' : 'text-red-200'}`}>
            {summary.netBalance >= 0 ? '+' : ''}{formatCurrency(summary.netBalance)}
          </p>
          <p className="text-teal-100 text-xs mt-1">
            {summary.netBalance > 0 && 'You are owed money'}
            {summary.netBalance < 0 && 'You owe money'}
            {summary.netBalance === 0 && 'All settled up! 🎉'}
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Link to={`/groups/${id}/expense/new`}>
          <Button fullWidth>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </Button>
        </Link>
        <Link to={`/groups/${id}/settle`}>
          <Button variant="secondary" fullWidth>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Settle Up
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['expenses', 'balances', 'members'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div>
          {expenses.length === 0 ? (
            <Card>
              <EmptyState
                icon="💰"
                title="No expenses yet"
                description="Add your first expense to this group"
                action={
                  <Link to={`/groups/${id}/expense/new`}>
                    <Button size="sm">Add Expense</Button>
                  </Link>
                }
              />
            </Card>
          ) : (
            <Card padding="none">
              <div className="divide-y divide-gray-100">
                {expenses.map((expense) => (
                  <div key={expense._id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">💸</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expense.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {expense.paidBy?._id === user?._id 
                              ? 'You paid' 
                              : `${expense.paidBy?.name} paid`}
                            {' • '}{formatDate(expense.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Split among {expense.splitAmong?.length} people
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </p>
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
                          className="text-xs text-red-500 hover:text-red-600 mt-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Balances Tab */}
      {activeTab === 'balances' && (
        <div>
          {balances?.balances?.length === 0 ? (
            <Card>
              <EmptyState
                icon="✨"
                title="All settled up!"
                description="No pending balances in this group"
              />
            </Card>
          ) : (
            <Card>
              <div className="space-y-4">
                {balances?.balances?.map((balance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Avatar name={balance.from?.name} size="sm" />
                      <span className="text-sm text-gray-600">owes</span>
                      <Avatar name={balance.to?.name} size="sm" />
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(balance.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Members</h3>
              <button
                onClick={() => setShowAddMember(true)}
                className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            <div className="space-y-3">
              {group.members?.map((member) => (
                <div key={member._id} className="flex items-center gap-3">
                  <Avatar name={member.name} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {member.name}
                      {member._id === user?._id && (
                        <span className="ml-2 text-xs text-teal-600">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  {member._id === group.createdBy?._id && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMember}
        onClose={() => {
          setShowAddMember(false);
          setMemberEmail('');
          setMemberError('');
        }}
        title="Add Member"
      >
        <form onSubmit={handleAddMember} className="space-y-4">
          {memberError && (
            <Alert type="error" message={memberError} onClose={() => setMemberError('')} />
          )}
          <Input
            label="Email Address"
            type="email"
            value={memberEmail}
            onChange={(e) => {
              setMemberEmail(e.target.value);
              if (memberError) setMemberError('');
            }}
            placeholder="friend@example.com"
            required
          />
          <p className="text-xs text-gray-500">
            The user must already have a registered account
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddMember(false);
                setMemberEmail('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={addingMember} className="flex-1">
              Add Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
