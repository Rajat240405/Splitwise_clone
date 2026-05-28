import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { expensesAPI, balancesAPI, groupsAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    balances: null,
    recentExpenses: [],
    groups: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [balancesRes, expensesRes, groupsRes] = await Promise.all([
        balancesAPI.getGlobal(),
        expensesAPI.getRecent(),
        groupsAPI.getAll()
      ]);
      
      setData({
        balances: balancesRes.data.data,
        recentExpenses: expensesRes.data.data.expenses,
        groups: groupsRes.data.data.groups
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const { balances, recentExpenses, groups } = data;
  const summary = balances?.summary || { totalOwed: 0, totalOwing: 0, netBalance: 0 };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's your expense summary
        </p>
      </div>

      {/* Balance Summary Card */}
      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="text-center">
          <p className="text-teal-100 text-sm mb-1">Your Overall Balance</p>
          <p className={`text-3xl font-bold ${summary.netBalance >= 0 ? 'text-white' : 'text-red-200'}`}>
            {summary.netBalance >= 0 ? '+' : ''}{formatCurrency(summary.netBalance)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <p className="text-teal-100 text-xs">You are owed</p>
            <p className="text-xl font-semibold text-green-200">
              {formatCurrency(summary.totalOwed)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-teal-100 text-xs">You owe</p>
            <p className="text-xl font-semibold text-red-200">
              {formatCurrency(summary.totalOwing)}
            </p>
          </div>
        </div>
      </Card>

      {/* Balance Details */}
      {balances?.balances?.length > 0 && (
        <Card>
          <h2 className="font-semibold text-gray-900 mb-3">Balance with Friends</h2>
          <div className="space-y-3">
            {balances.balances.map((balance, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={balance.user?.name} size="sm" />
                  <span className="text-sm text-gray-700">{balance.user?.name}</span>
                </div>
                <span className={`text-sm font-medium ${
                  balance.type === 'owed' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {balance.type === 'owed' ? '+' : '-'}{formatCurrency(balance.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/groups/new">
          <Card hover className="text-center">
            <span className="text-2xl">👥</span>
            <p className="text-sm font-medium text-gray-700 mt-2">New Group</p>
          </Card>
        </Link>
        <Link to="/groups">
          <Card hover className="text-center">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-medium text-gray-700 mt-2">Add Expense</p>
          </Card>
        </Link>
      </div>

      {/* Your Groups */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Your Groups</h2>
          <Link to="/groups" className="text-sm text-teal-600 hover:text-teal-700">
            View all
          </Link>
        </div>
        
        {groups.length === 0 ? (
          <Card>
            <EmptyState
              icon="👥"
              title="No groups yet"
              description="Create a group to start splitting expenses"
              action={
                <Link to="/groups/new">
                  <Button size="sm">Create Group</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-2">
            {groups.slice(0, 3).map((group) => (
              <Link key={group._id} to={`/groups/${group._id}`}>
                <Card hover className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 text-lg">👥</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{group.name}</p>
                      <p className="text-xs text-gray-500">
                        {group.members?.length} members
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-3">Recent Activity</h2>
        
        {recentExpenses.length === 0 ? (
          <Card>
            <EmptyState
              icon="📝"
              title="No expenses yet"
              description="Add your first expense to get started"
            />
          </Card>
        ) : (
          <Card padding="none">
            <div className="divide-y divide-gray-100">
              {recentExpenses.slice(0, 5).map((expense) => (
                <div key={expense._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">💸</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{expense.description}</p>
                      <p className="text-xs text-gray-500">
                        {expense.groupId?.name} • {formatDate(expense.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                    <p className="text-xs text-gray-500">
                      {expense.paidBy?._id === user?._id ? 'You paid' : `${expense.paidBy?.name?.split(' ')[0]} paid`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
