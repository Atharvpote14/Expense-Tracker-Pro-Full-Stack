import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun, FiDownload, FiTrash2 } from 'react-icons/fi';
import { useToast } from '../components/Toast';
import { expenseService } from '../services/api';

export default function Settings({ darkMode, toggleDarkMode }) {
  const addToast = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await expenseService.getAll({ limit: 10000 });
      const expenses = res.data.expenses || [];
      const headers = ['Title', 'Amount', 'Category', 'Payment Method', 'Expense Date', 'Notes'];
      const rows = expenses.map(e => [
        `"${e.title}"`, e.amount, `"${e.category}"`, `"${e.payment_method}"`,
        e.expense_date, `"${(e.notes || '').replace(/"/g, '""')}"`,
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Expenses exported successfully', 'success');
    } catch {
      addToast('Failed to export expenses', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Customize your experience</p>
      </div>

      <div className="settings-sections">
        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Appearance</h3>
          <p className="settings-desc">Toggle between dark and light mode</p>
          <div className="theme-selector">
            <button
              className={`theme-option ${!darkMode ? 'active' : ''}`}
              onClick={() => darkMode && toggleDarkMode()}
            >
              <FiSun />
              <span>Light</span>
            </button>
            <button
              className={`theme-option ${darkMode ? 'active' : ''}`}
              onClick={() => !darkMode && toggleDarkMode()}
            >
              <FiMoon />
              <span>Dark</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3>Data Management</h3>
          <p className="settings-desc">Export or manage your expense data</p>
          <div className="settings-actions">
            <button className="btn-primary" onClick={handleExport} disabled={exporting}>
              <FiDownload /> {exporting ? 'Exporting...' : 'Export to CSV'}
            </button>
          </div>
        </motion.div>

        <motion.div
          className="settings-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>About</h3>
          <div className="about-info">
            <div className="about-row">
              <span>Version</span>
              <span className="about-value">1.0.0</span>
            </div>
            <div className="about-row">
              <span>Framework</span>
              <span className="about-value">React + Express + Neon</span>
            </div>
            <div className="about-row">
              <span>Database</span>
              <span className="about-value">PostgreSQL (Neon)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
