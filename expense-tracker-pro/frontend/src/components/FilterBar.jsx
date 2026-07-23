import { useState } from 'react';
import { FiCalendar, FiFilter, FiX } from 'react-icons/fi';

const CATEGORIES = ['', 'Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Education', 'Health', 'Other'];
const PAYMENT_METHODS = ['', 'Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];

export default function FilterBar({ filters, onFilterChange }) {
  const [showCustom, setShowCustom] = useState(false);
  const [open, setOpen] = useState(false);

  const datePresets = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Custom', value: 'custom' },
  ];

  const handlePreset = (preset) => {
    if (preset === 'custom') {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    const now = new Date();
    let start = '';
    if (preset === 'today') {
      start = now.toISOString().split('T')[0];
      onFilterChange({ ...filters, startDate: start, endDate: start });
    } else if (preset === 'week') {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      start = new Date(now.setDate(now.getDate() - diff)).toISOString().split('T')[0];
      const end = new Date().toISOString().split('T')[0];
      onFilterChange({ ...filters, startDate: start, endDate: end });
    } else if (preset === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const end = new Date().toISOString().split('T')[0];
      onFilterChange({ ...filters, startDate: start, endDate: end });
    }
  };

  const clearFilters = () => {
    onFilterChange({});
    setShowCustom(false);
  };

  const hasFilters = filters.startDate || filters.category || filters.payment_method || filters.minAmount || filters.maxAmount;

  return (
    <div className="filter-bar">
      <button className="filter-toggle" onClick={() => setOpen(!open)}>
        <FiFilter />
        Filters
        {hasFilters && <span className="filter-badge" />}
      </button>

      {open && (
        <div className="filter-dropdown">
          <div className="filter-section">
            <h4>Date Range</h4>
            <div className="date-presets">
              {datePresets.map(p => (
                <button key={p.value} className="preset-btn" onClick={() => handlePreset(p.value)}>
                  {p.label}
                </button>
              ))}
            </div>
            {showCustom && (
              <div className="custom-dates">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={e => onFilterChange({ ...filters, startDate: e.target.value })}
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={e => onFilterChange({ ...filters, endDate: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            <select
              value={filters.category || ''}
              onChange={e => onFilterChange({ ...filters, category: e.target.value })}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c || 'All Categories'}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Payment Method</h4>
            <select
              value={filters.payment_method || ''}
              onChange={e => onFilterChange({ ...filters, payment_method: e.target.value })}
            >
              {PAYMENT_METHODS.map(p => (
                <option key={p} value={p}>{p || 'All Methods'}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Amount Range</h4>
            <div className="amount-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount || ''}
                onChange={e => onFilterChange({ ...filters, minAmount: e.target.value })}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount || ''}
                onChange={e => onFilterChange({ ...filters, maxAmount: e.target.value })}
              />
            </div>
          </div>

          {hasFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              <FiX /> Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
