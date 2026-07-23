import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import { CATEGORY_COLORS } from '../utils';

export default function ExpenseTable({ expenses, pagination, onEdit, onDelete, sort, onSortChange, onPageChange }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const exportCSV = () => {
    const headers = ['Title', 'Amount', 'Category', 'Payment Method', 'Date', 'Notes'];
    const rows = expenses.map(e => [
      `"${e.title}"`, e.amount, `"${e.category}"`, `"${e.payment_method}"`,
      e.expense_date, `"${e.notes || ''}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (field) => {
    const sortMap = {
      latest: 'oldest', oldest: 'latest',
      highest: 'lowest', lowest: 'highest',
      'a-z': 'z-a', 'z-a': 'a-z',
    };
    const fieldMap = {
      date: ['latest', 'oldest'],
      amount: ['highest', 'lowest'],
      title: ['a-z', 'z-a'],
    };
    const currentGroup = fieldMap[field];
    if (currentGroup) {
      if (currentGroup.includes(sort)) {
        onSortChange(sortMap[sort] || currentGroup[0]);
      } else {
        onSortChange(currentGroup[0]);
      }
    }
  };

  const getSortIcon = (field) => {
    const fieldMap = { date: ['latest', 'oldest'], amount: ['highest', 'lowest'], title: ['a-z', 'z-a'] };
    const group = fieldMap[field];
    if (!group) return '';
    if (sort === group[0]) return ' ▲';
    if (sort === group[1]) return ' ▼';
    return '';
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="expense-table-wrapper">
      <div className="table-toolbar">
        <button className="btn-export" onClick={exportCSV}>
          <FiDownload /> Export CSV
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <svg className="empty-svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect x="20" y="40" width="80" height="60" rx="8" className="empty-svg-rect" strokeWidth="2" />
              <path d="M40 55h40M40 65h30M40 75h35" className="empty-svg-lines" strokeWidth="2" strokeLinecap="round" />
              <circle cx="90" cy="30" r="15" className="empty-svg-circle" opacity="0.2" />
              <path d="M85 30l4 4 6-8" className="empty-svg-check" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3>No expenses found</h3>
          <p>Start by adding your first expense</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('title')}>
                    Title<span className="sort-icon">{getSortIcon('title')}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort('amount')}>
                    Amount<span className="sort-icon">{getSortIcon('amount')}</span>
                  </th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th className="sortable" onClick={() => handleSort('date')}>
                    Date<span className="sort-icon">{getSortIcon('date')}</span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {expenses.map((expense, idx) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td><span className="expense-title">{expense.title}</span></td>
                      <td className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</td>
                      <td>
                        <span
                          className="category-badge"
                          style={{ background: `${CATEGORY_COLORS[expense.category] || 'var(--accent)'}20`, color: CATEGORY_COLORS[expense.category] || 'var(--accent)' }}
                        >
                          {expense.category}
                        </span>
                      </td>
                      <td><span className="payment-badge">{expense.payment_method}</span></td>
                      <td className="expense-date">{formatDate(expense.expense_date)}</td>
                      <td>
                        <div className="action-btns">
                          <button className="btn-icon edit" onClick={() => onEdit(expense)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="btn-icon delete" onClick={() => setConfirmDelete(expense)} title="Delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={pagination.page <= 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                <FiChevronLeft />
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="page-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="confirm-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Delete Expense</h3>
              <p>Are you sure you want to delete "<strong>{confirmDelete.title}</strong>"?</p>
              <div className="confirm-actions">
                <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn-danger" onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
