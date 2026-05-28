import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { groupsAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    memberEmails: ['']
  });

  const handleNameChange = (e) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
    if (error) setError('');
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.memberEmails];
    newEmails[index] = value;
    setFormData(prev => ({ ...prev, memberEmails: newEmails }));
    if (error) setError('');
  };

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      memberEmails: [...prev.memberEmails, '']
    }));
  };

  const removeEmailField = (index) => {
    if (formData.memberEmails.length === 1) return;
    const newEmails = formData.memberEmails.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, memberEmails: newEmails }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter a group name');
      return;
    }

    // Filter out empty emails
    const validEmails = formData.memberEmails.filter(email => email.trim());

    try {
      setLoading(true);
      setError('');
      
      const response = await groupsAPI.create({
        name: formData.name.trim(),
        memberEmails: validEmails
      });
      
      navigate(`/groups/${response.data.data.group._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Create Group</h1>
          <p className="text-gray-500 text-sm">Start splitting expenses together</p>
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
          {/* Group Name */}
          <Input
            label="Group Name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g., Trip to Goa, Roommates"
            required
          />

          {/* Member Emails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Members (optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Enter email addresses of registered users
            </p>
            
            <div className="space-y-3">
              {formData.memberEmails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="friend@example.com"
                  />
                  {formData.memberEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addEmailField}
              className="mt-3 text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another member
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/groups')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Create Group
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
