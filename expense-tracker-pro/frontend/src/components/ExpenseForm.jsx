import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];

export default function ExpenseForm({ isOpen, onClose, onSubmit, initialData, disabled }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    payment_method: 'Cash',
    expense_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount?.toString() || '',
        category: initialData.category || 'Food',
        payment_method: initialData.payment_method || 'Cash',
        expense_date: initialData.expense_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setForm({
        title: '',
        amount: '',
        category: 'Food',
        payment_method: 'Cash',
        expense_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Amount must be greater than 0';
    if (!form.expense_date) errs.expense_date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
              <button className="modal-close" onClick={onClose}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="e.g. Grocery Shopping"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={errors.title ? 'input-error' : ''}
                />
                {errors.title && <span className="form-error">{errors.title}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className={errors.amount ? 'input-error' : ''}
                  />
                  {errors.amount && <span className="form-error">{errors.amount}</span>}
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.expense_date}
                    onChange={e => setForm({ ...form, expense_date: e.target.value })}
                    className={errors.expense_date ? 'input-error' : ''}
                  />
                  {errors.expense_date && <span className="form-error">{errors.expense_date}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={form.payment_method}
                    onChange={e => setForm({ ...form, payment_method: e.target.value })}
                  >
                    {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  placeholder="Add any notes..."
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={disabled}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={disabled}>
                  {disabled ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
