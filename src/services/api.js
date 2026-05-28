import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH API ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// ============ GROUPS API ============
export const groupsAPI = {
  create: (data) => api.post('/groups', data),
  getAll: () => api.get('/groups'),
  getOne: (id) => api.get(`/groups/${id}`),
  addMember: (id, email) => api.post(`/groups/${id}/members`, { email }),
  removeMember: (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`)
};

// ============ EXPENSES API ============
export const expensesAPI = {
  create: (data) => api.post('/expenses', data),
  getByGroup: (groupId) => api.get(`/expenses/group/${groupId}`),
  getRecent: () => api.get('/expenses/recent'),
  delete: (id) => api.delete(`/expenses/${id}`)
};

// ============ SETTLEMENTS API ============
export const settlementsAPI = {
  create: (data) => api.post('/settlements', data),
  getByGroup: (groupId) => api.get(`/settlements/group/${groupId}`),
  getHistory: () => api.get('/settlements/history')
};

// ============ BALANCES API ============
export const balancesAPI = {
  getByGroup: (groupId) => api.get(`/balances/group/${groupId}`),
  getGlobal: () => api.get('/balances/global')
};

export default api;
