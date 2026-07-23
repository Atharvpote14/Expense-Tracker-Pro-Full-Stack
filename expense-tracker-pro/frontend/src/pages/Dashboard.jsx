import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { expenseService } from '../services/api';
import DashboardCards from '../components/DashboardCards';
import {
  MonthlySpendingChart, CategoryDonutChart, TopCategoriesChart,
  WeeklySpendingChart, ExpenseTimeline,
} from '../components/Charts';
import { SkeletonCard } from '../components/Loader';
import { FiBarChart2, FiDownload, FiPlus, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { CATEGORY_COLORS, transformAnalytics } from '../utils';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDateFull() {
  const d = new Date();
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function MiniBadge({ category }) {
  const color = CATEGORY_COLORS[category] || '#6C63FF';
  return (
    <span className="mini-badge" style={{ background: `${color}18`, color }}>
      {category}
    </span>
  );
}

export default function Dashboard({ onAddExpense }) {
  const { data: analyticsData, loading, error, refetch } = useFetch(
    () => expenseService.getAnalytics(),
    []
  );

  const analytics = useMemo(
    () => transformAnalytics(analyticsData?.analytics),
    [analyticsData]
  );

  const hasData = analytics && analytics.totalTransactions > 0;
  const recent = analytics?.recentActivity || [];

  if (loading) {
    return (
      <div className="page-container">
        <div className="welcome-section">
          <div>
            <h2 className="welcome-greeting">{getGreeting()} <span>👋</span></h2>
            <p className="welcome-date">{formatDateFull()}</p>
          </div>
        </div>
        <div className="stat-cards">
          {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <p>{error}</p>
          <button className="btn-primary" onClick={refetch}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome */}
      <div className="welcome-section">
        <div>
          <h2 className="welcome-greeting">{getGreeting()} <span>👋</span></h2>
          <p className="welcome-date">{formatDateFull()}</p>
        </div>
        {hasData && (
          <div className="welcome-summary">
            <span className="welcome-summary-label">Total Balance Tracked</span>
            <span className="welcome-summary-value">${Number(analytics.totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <DashboardCards analytics={analytics} />

      {/* Charts Row 2: Monthly Trend + Donut */}
      {hasData && (
        <div className="dashboard-grid-2">
          <MonthlySpendingChart data={analytics.monthlyTrend} />
          <CategoryDonutChart data={analytics.categoryBreakdown} />
        </div>
      )}

      {/* Charts Row 3: Top Categories + Recent Activity + Weekly Spending */}
      {hasData && (
        <div className="dashboard-grid-3">
          <TopCategoriesChart data={analytics.topCategories} />
          <ExpenseTimeline data={recent} />
          <WeeklySpendingChart data={analytics.dailyTrend ? groupByWeek(analytics.dailyTrend) : []} />
        </div>
      )}

      {/* Row 4: Latest Expenses + Quick Actions */}
      <div className="dashboard-grid-2-equal">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="chart-card-header">
            <h3 className="chart-card-title">Latest Expenses</h3>
            {recent.length > 0 && <span className="chart-card-badge">{recent.length} entries</span>}
          </div>
          {recent.length === 0 ? (
            <div className="chart-no-data" style={{ height: 200 }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ opacity: 0.2 }}>
                <rect x="12" y="18" width="36" height="28" rx="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M20 28h20M20 35h14M20 42h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p>No expenses yet. <strong>Add your first expense!</strong></p>
            </div>
          ) : (
            <>
              <table className="minimal-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.slice(0, 5).map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 500 }}>{item.title}</td>
                      <td className="cat-cell"><MiniBadge category={item.category} /></td>
                      <td className="date-cell">{new Date(item.expense_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className="amount-cell" style={{ textAlign: 'right' }}>-${Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/expenses" className="table-show-all">
                View all expenses <FiArrowRight style={{ display: 'inline', verticalAlign: 'middle' }} />
              </Link>
            </>
          )}
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <div className="chart-card-header">
            <h3 className="chart-card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="quick-action" onClick={() => onAddExpense && onAddExpense()}>
              <div className="quick-action-icon" style={{ background: 'rgba(108,99,255,0.12)', color: 'var(--accent)' }}>
                <FiPlus />
              </div>
              <div className="quick-action-info">
                <div className="quick-action-title">Add Expense</div>
                <div className="quick-action-desc">Record a new transaction</div>
              </div>
              <FiChevronRight className="quick-action-arrow" />
            </button>

            <Link to="/analytics" className="quick-action" style={{ textDecoration: 'none' }}>
              <div className="quick-action-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>
                <FiBarChart2 />
              </div>
              <div className="quick-action-info">
                <div className="quick-action-title">View Analytics</div>
                <div className="quick-action-desc">Deep insights into spending</div>
              </div>
              <FiChevronRight className="quick-action-arrow" />
            </Link>

            <button className="quick-action" onClick={() => exportCSV(recent)}>
              <div className="quick-action-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
                <FiDownload />
              </div>
              <div className="quick-action-info">
                <div className="quick-action-title">Export Data</div>
                <div className="quick-action-desc">Download as CSV</div>
              </div>
              <FiChevronRight className="quick-action-arrow" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function groupByWeek(records) {
  if (!records || records.length === 0) return [];
  const weeks = {};
  for (const r of records) {
    const d = new Date(r.expense_date);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
    const key = start.toISOString().slice(0, 10);
    if (!weeks[key]) weeks[key] = { week: `W${Math.ceil(1 + (d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)}`, total: 0 };
    weeks[key].total += Number(r.total);
  }
  return Object.values(weeks).sort((a, b) => a.week.localeCompare(b.week)).slice(-8);
}

function exportCSV(expenses) {
  if (!expenses || expenses.length === 0) return;
  const headers = ['Title', 'Amount', 'Category', 'Payment Method', 'Date', 'Notes'];
  const rows = expenses.map(e => [
    `"${e.title}"`, e.amount, `"${e.category}"`, `"${e.payment_method || ''}"`,
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
}
