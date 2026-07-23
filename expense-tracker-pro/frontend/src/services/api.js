import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

export const expenseService = {
  getAll(params) {
    return api.get('/api/expenses', { params });
  },

  getById(id) {
    return api.get(`/api/expenses/${id}`);
  },

  create(data) {
    return api.post('/api/expenses', data);
  },

  update(id, data) {
    return api.put(`/api/expenses/${id}`, data);
  },

  delete(id) {
    return api.delete(`/api/expenses/${id}`);
  },

  getAnalytics() {
    return api.get('/api/expenses/analytics');
  },
};

export default api;
