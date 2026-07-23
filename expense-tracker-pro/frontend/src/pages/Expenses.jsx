import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useFetch } from '../hooks/useFetch';
import { expenseService } from '../services/api';
import { useToast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import { SkeletonTable } from '../components/Loader';

export default function Expenses() {
  const addToast = useToast();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const buildParams = useCallback(() => {
    const params = { sort, page, limit: 10 };
    if (search) params.search = search;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.category) params.category = filters.category;
    if (filters.payment_method) params.payment_method = filters.payment_method;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;
    return params;
  }, [search, filters, sort, page]);

  const { data, loading, error, refetch } = useFetch(
    () => expenseService.getAll(buildParams()),
    [buildParams]
  );

  const expenses = data?.expenses || [];
  const pagination = data?.pagination || null;

  const handleCreate = async (formData) => {
    setSaving(true);
    try {
      await expenseService.create(formData);
      addToast('Expense added successfully', 'success');
      setShowForm(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add expense', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await expenseService.update(editingExpense.id, formData);
      addToast('Expense updated successfully', 'success');
      setEditingExpense(null);
      setShowForm(false);
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update expense', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await expenseService.delete(id);
      addToast('Expense deleted successfully', 'success');
      refetch();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete expense', 'error');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingExpense) {
      handleUpdate(formData);
    } else {
      handleCreate(formData);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Manage all your transactions</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingExpense(null); setShowForm(true); }}>
          <FiPlus /> Add Expense
        </button>
      </div>

      <div className="expense-controls">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button className="btn-primary" onClick={refetch}>Retry</button>
        </div>
      ) : (
        <ExpenseTable
          expenses={expenses}
          pagination={pagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sort={sort}
          onSortChange={handleSortChange}
          onPageChange={setPage}
        />
      )}

      <ExpenseForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingExpense(null); }}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        disabled={saving}
      />
    </motion.div>
  );
}
