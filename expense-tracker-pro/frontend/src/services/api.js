import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const expenseService = {
  getAll(params) {
    return api.get('/expenses', { params });
  },

  getById(id) {
    return api.get(`/expenses/${id}`);
  },

  create(data) {
    return api.post('/expenses', data);
  },

  update(id, data) {
    return api.put(`/expenses/${id}`, data);
  },

  delete(id) {
    return api.delete(`/expenses/${id}`);
  },

  getAnalytics() {
    return api.get('/expenses/analytics');
  },
};

export default api;
