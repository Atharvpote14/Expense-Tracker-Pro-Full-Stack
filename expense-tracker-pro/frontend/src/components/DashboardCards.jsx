import { FiDollarSign, FiTrendingUp, FiCalendar, FiActivity, FiCreditCard } from 'react-icons/fi';
import StatCard from './StatCard';

export default function DashboardCards({ analytics }) {
  if (!analytics) return null;

  const cards = [
    {
      title: 'Total Expenses',
      value: analytics.totalExpenses,
      prefix: '$',
      icon: <FiDollarSign />,
      color: '#6C63FF',
      decimals: 2,
      trend: { direction: 'up', label: 'All time' },
    },
    {
      title: "Today's Expenses",
      value: analytics.todayExpenses,
      prefix: '$',
      icon: <FiCalendar />,
      color: '#10B981',
      decimals: 2,
      trend: { direction: 'neutral', label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
    },
    {
      title: 'Monthly Expenses',
      value: analytics.monthlyExpenses,
      prefix: '$',
      icon: <FiTrendingUp />,
      color: '#8B5CF6',
      decimals: 2,
      trend: { direction: 'up', label: 'This month' },
    },
    {
      title: 'Transactions',
      value: analytics.totalTransactions,
      icon: <FiActivity />,
      color: '#EC4899',
      trend: { direction: 'neutral', label: 'Total entries' },
    },
    {
      title: 'Average Expense',
      value: analytics.averageExpense,
      prefix: '$',
      icon: <FiCreditCard />,
      color: '#F59E0B',
      decimals: 2,
      trend: { direction: 'neutral', label: 'Per transaction' },
    },
  ];

  return (
    <div className="stat-cards">
      {cards.map((card, idx) => (
        <StatCard key={idx} {...card} />
      ))}
    </div>
  );
}
