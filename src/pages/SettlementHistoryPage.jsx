import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { settlementsAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatCurrency';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

export default function SettlementHistoryPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const response = await settlementsAPI.getHistory();
      setSettlements(response.data.data.settlements);
    } catch (error) {
      console.error('Error fetching settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading history..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settlement History</h1>
        <p className="text-gray-500 text-sm mt-1">
          {settlements.length} settlement{settlements.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Settlements List */}
      {settlements.length === 0 ? (
        <Card>
          <EmptyState
            icon="📜"
            title="No settlements yet"
            description="Your settlement history will appear here"
          />
        </Card>
      ) : (
        <Card padding="none">
          <div className="divide-y divide-gray-100">
            {settlements.map((settlement) => {
              const isPayer = settlement.paidBy?._id === user?._id;
              const otherPerson = isPayer ? settlement.paidTo : settlement.paidBy;
              
              return (
                <div key={settlement._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isPayer ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <span className="text-lg">
                          {isPayer ? '💸' : '💰'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {isPayer 
                            ? `You paid ${otherPerson?.name}`
                            : `${otherPerson?.name} paid you`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {settlement.groupId?.name} • {formatDate(settlement.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isPayer ? 'text-red-600' : 'text-green-600'}`}>
                        {isPayer ? '-' : '+'}{formatCurrency(settlement.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
