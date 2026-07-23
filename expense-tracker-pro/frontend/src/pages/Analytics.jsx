import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../hooks/useFetch';
import { expenseService } from '../services/api';
import {
  MonthlySpendingChart, CategoryDonutChart, TopCategoriesChart,
  WeeklySpendingChart, PaymentBreakdownChart, ExpenseTimeline,
} from '../components/Charts';
import { SkeletonCard } from '../components/Loader';
import { FiBarChart2, FiInbox, FiDollarSign, FiTrendingUp, FiCalendar, FiActivity } from 'react-icons/fi';

function groupByWeek(records) {
  if (!records || records.length === 0) return [];
  const weeks = {};
  for (const r of records) {
    const d = new Date(r.expense_date);
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
    const key = start.toISOString().slice(0, 10);
    if (!weeks[key]) weeks[key] = { week: `W${Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)}`, total: 0 };
    weeks[key].total += Number(r.total);
  }
  const sorted = Object.values(weeks).sort((a, b) => a.week.localeCompare(b.week));
  return sorted.slice(-8);
}

function transformAnalytics(raw) {
  if (!raw) return null;
  return {
    monthlyTrend: (raw.monthlyTrend || []).map(d => ({
      month: `${d.month} ${d.year}`,
      total: Number(d.total),
    })),
    categoryBreakdown: (raw.categoryBreakdown || []).map(d => ({
      category: d.category,
      total: Number(d.total),
      count: Number(d.count),
    })),
    topCategories: (raw.topCategories || []).map(d => ({
      category: d.category,
      total: Number(d.total),
    })),
    paymentMethodBreakdown: (raw.paymentMethodBreakdown || []).map(d => ({
      payment_method: d.payment_method,
      total: Number(d.total),
      count: Number(d.count),
    })),
    weeklyTrend: groupByWeek(raw.dailyTrend),
    recentActivity: raw.recentActivity || [],
    totalExpenses: Number(raw.totalExpenses),
    totalTransactions: Number(raw.totalTransactions),
    monthlyExpenses: Number(raw.monthlyExpenses),
    averageExpense: Number(raw.averageExpense),
  };
}

function StatCardSmall({ title, value, prefix = '', icon, color }) {
  return (
    <motion.div
      className="stat-card-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="stat-card-sm-icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="stat-card-sm-body">
        <span className="stat-card-sm-title">{title}</span>
        <span className="stat-card-sm-value">{prefix}{typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}</span>
      </div>
    </motion.div>
  );
}

export default function Analytics() {
  const { data: analyticsData, loading, error, refetch } = useFetch(
    () => expenseService.getAnalytics(),
    []
  );

  const analytics = useMemo(
    () => transformAnalytics(analyticsData?.analytics),
    [analyticsData]
  );

  const hasData = analytics && analytics.totalTransactions > 0;

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Analytics</h1>
        <div className="analytics-grid">
          <div className="analytics-stats">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1 className="page-title">Analytics</h1>
        <div className="error-state">
          <p>{error}</p>
          <button className="btn-primary" onClick={refetch}>Retry</button>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="page-header">
          <h1 className="page-title"><FiBarChart2 /> Analytics</h1>
          <p className="page-subtitle">Deep insights into your spending habits</p>
        </div>
        <div className="empty-analytics">
          <FiInbox className="empty-analytics-icon" />
          <h3>No analytics available yet.</h3>
          <p>Add some expenses to see charts and breakdowns.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1 className="page-title"><FiBarChart2 /> Analytics</h1>
        <p className="page-subtitle">Deep insights into your spending habits</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-stats">
          <StatCardSmall title="Total Spent" value={analytics.totalExpenses} prefix="$" icon={<FiDollarSign />} color="#6366f1" />
          <StatCardSmall title="Transactions" value={analytics.totalTransactions} icon={<FiActivity />} color="#8b5cf6" />
          <StatCardSmall title="Monthly Spend" value={analytics.monthlyExpenses} prefix="$" icon={<FiCalendar />} color="#10b981" />
          <StatCardSmall title="Average" value={analytics.averageExpense} prefix="$" icon={<FiTrendingUp />} color="#f59e0b" />
        </div>

        <div className="analytics-row cols-wide">
          <MonthlySpendingChart data={analytics.monthlyTrend} />
          <CategoryDonutChart data={analytics.categoryBreakdown} />
        </div>

        <div className="analytics-row cols-equal">
          <TopCategoriesChart data={analytics.topCategories} />
          <WeeklySpendingChart data={analytics.weeklyTrend} />
        </div>

        <div className="analytics-row cols-wide-rev">
          <ExpenseTimeline data={analytics.recentActivity} />
          <PaymentBreakdownChart data={analytics.paymentMethodBreakdown} />
        </div>
      </div>
    </motion.div>
  );
}
