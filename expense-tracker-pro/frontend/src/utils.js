export const CATEGORY_COLORS = {
  Food: '#10b981',
  Travel: '#6366f1',
  Shopping: '#ec4899',
  Bills: '#f59e0b',
  Entertainment: '#8b5cf6',
  Education: '#06b6d4',
  Health: '#ef4444',
  Other: '#6b7280',
};

export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];
export const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];

export function transformAnalytics(raw) {
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
    totalExpenses: Number(raw.totalExpenses),
    todayExpenses: Number(raw.todayExpenses),
    monthlyExpenses: Number(raw.monthlyExpenses),
    totalTransactions: Number(raw.totalTransactions),
    averageExpense: Number(raw.averageExpense),
    recentActivity: raw.recentActivity || [],
    dailyTrend: (raw.dailyTrend || []).map(d => ({
      ...d,
      total: Number(d.total),
    })),
  };
}
