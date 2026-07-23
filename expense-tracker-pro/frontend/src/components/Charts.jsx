import { useId } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
} from 'recharts';
import {
  FiCoffee, FiGlobe, FiShoppingBag, FiFileText, FiMusic,
  FiBook, FiHeart, FiMoreHorizontal, FiClock,
} from 'react-icons/fi';

const COLORS = ['#6C63FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#F97316', '#EF4444'];

const CATEGORY_ICONS = {
  Food: FiCoffee, Travel: FiGlobe, Shopping: FiShoppingBag,
  Bills: FiFileText, Entertainment: FiMusic, Education: FiBook,
  Health: FiHeart, Other: FiMoreHorizontal,
};

function ChartEmptyState({ message }) {
  return (
    <div className="chart-no-data">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
        <path d="M24 36h24M36 24v24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M46 18l8 8M26 54l-8-8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
      <p dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
}

function ChartCard({ title, badge, children, delay = 0 }) {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
        {badge && <span className="chart-card-badge">{badge}</span>}
      </div>
      {children}
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-label">{label}</p>}
      {payload.map((e, i) => (
        <p key={i} className="chart-tooltip-value" style={{ color: e.color }}>
          {formatter ? formatter(e) : `${e.name}: $${Number(e.value).toLocaleString()}`}
        </p>
      ))}
    </div>
  );
}

export function MonthlySpendingChart({ data }) {
  const id = useId();
  const hasData = data && data.length > 0;
  const enoughData = hasData && data.length >= 2;
  const lastIdx = hasData ? data.length - 1 : -1;

  return (
    <ChartCard title="Monthly Spending Trend" badge={hasData ? `${data.length} months` : ''} delay={0.1}>
      {enoughData ? (
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} dy={8} />
              <YAxis axisLine={false} tickLine={false} dx={-4} tickFormatter={v => `$${v}`} />
              <Tooltip
                content={<ChartTooltip formatter={e => `Total: $${Number(e.value).toLocaleString()}`} />}
                cursor={{ stroke: 'var(--chart-cursor-stroke)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line
                type="monotone" dataKey="total"
                stroke={`url(#line-${id})`}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--accent-light)', stroke: 'var(--chart-dot-border)', strokeWidth: 2 }}
                isAnimationActive={true}
              />
              <Line
                type="monotone" dataKey="total"
                stroke="none"
                dot={(props) => {
                  const { cx, cy, index } = props;
                  if (index === lastIdx) {
                    return (
                      <svg x={cx - 7} y={cy - 7} width={14} height={14}>
                        <circle cx={7} cy={7} r={6} fill="var(--accent-light)" stroke="var(--chart-dot-border)" strokeWidth={2} />
                      </svg>
                    );
                  }
                  return <circle cx={cx} cy={cy} r={3} fill="var(--accent)" />;
                }}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ChartEmptyState
          message={hasData
            ? 'Add more expenses across different months to see your spending trend.'
            : 'No spending data yet. <strong>More data will appear as you add expenses.</strong>'}
        />
      )}
    </ChartCard>
  );
}

export function CategoryDonutChart({ data }) {
  const hasData = data && data.length > 0;
  const total = hasData ? data.reduce((s, d) => s + d.total, 0) : 0;

  return (
    <ChartCard title="Expense by Category" badge={hasData ? `${data.length} categories` : ''} delay={0.15}>
      {hasData ? (
        <div className="donut-wrapper">
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data} cx="50%" cy="50%"
                  innerRadius={65} outerRadius={105}
                  paddingAngle={3} dataKey="total" nameKey="category"
                  stroke="none" isAnimationActive={true} animationDuration={800}
                >
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={<ChartTooltip formatter={e => `$${Number(e.value).toLocaleString()} (${((e.value / total) * 100).toFixed(1)}%)`} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="donut-center">
            <span className="donut-center-label">Total</span>
            <span className="donut-center-value">${total.toLocaleString()}</span>
          </div>
          <div className="donut-legend">
            {data.map((e, i) => (
              <div key={e.category} className="donut-legend-item">
                <span className="donut-legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="donut-legend-name">{e.category}</span>
                <span className="donut-legend-pct">{((e.total / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ChartEmptyState message="No category data yet. <strong>More data will appear as you add expenses.</strong>" />
      )}
    </ChartCard>
  );
}

export function TopCategoriesChart({ data }) {
  const hasData = data && data.length > 0;
  const maxValue = hasData ? Math.max(...data.map(d => d.total)) : 0;

  return (
    <ChartCard title="Top Categories" delay={0.2}>
      {hasData ? (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data} layout="vertical"
              margin={{ top: 4, right: 60, left: 0, bottom: 0 }}
              barCategoryGap={14}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, maxValue * 1.35]} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={80} />
              <Tooltip
                content={<ChartTooltip formatter={e => `Total: $${Number(e.value).toLocaleString()}`} />}
                cursor={{ fill: 'var(--chart-cursor-fill)' }}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={20}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ChartEmptyState message="No category breakdown yet. <strong>More data will appear as you add expenses.</strong>" />
      )}
    </ChartCard>
  );
}

export function WeeklySpendingChart({ data }) {
  const id = useId();
  const hasData = data && data.length > 0;
  const enoughData = hasData && data.length >= 2;

  return (
    <ChartCard title="Weekly Spending" delay={0.25}>
      {enoughData ? (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={`weekly-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} dy={8} />
              <YAxis axisLine={false} tickLine={false} dx={-4} tickFormatter={v => `$${v}`} />
              <Tooltip
                content={<ChartTooltip formatter={e => `Total: $${Number(e.value).toLocaleString()}`} />}
                cursor={{ stroke: 'var(--chart-cursor-stroke)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={2.5} fill={`url(#weekly-${id})`} isAnimationActive={true} animationDuration={800} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <ChartEmptyState
          message={hasData
            ? 'Add more expenses across different weeks to see your weekly trend.'
            : 'No weekly data yet. <strong>More data will appear as you add expenses.</strong>'}
        />
      )}
    </ChartCard>
  );
}

export function PaymentBreakdownChart({ data }) {
  const hasData = data && data.length > 0;
  const total = hasData ? data.reduce((s, d) => s + d.total, 0) : 0;

  return (
    <ChartCard title="Payment Method" delay={0.3}>
      {hasData ? (
        <div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data} cx="50%" cy="50%"
                  innerRadius={45} outerRadius={72}
                  paddingAngle={2} dataKey="total" nameKey="payment_method"
                  stroke="none" isAnimationActive={true} animationDuration={600}
                >
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="payment-list">
            {data.map((e, i) => (
              <div key={e.payment_method} className="payment-item">
                <span className="payment-dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="payment-name">{e.payment_method}</span>
                <span className="payment-amount">${Number(e.total).toLocaleString()}</span>
                <span className="payment-pct">{((e.total / total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ChartEmptyState message="No payment data yet." />
      )}
    </ChartCard>
  );
}

export function ExpenseTimeline({ data }) {
  const hasData = data && data.length > 0;

  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!hasData) {
    return (
      <ChartCard title="Recent Activity" delay={0.35}>
        <ChartEmptyState message="No recent expenses." />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Recent Activity" delay={0.35}>
      <div className="timeline">
        {data.slice(0, 8).map((item, idx) => {
          const catKeys = Object.keys(CATEGORY_ICONS);
          const catIdx = catKeys.indexOf(item.category);
          const color = catIdx >= 0 ? COLORS[catIdx % COLORS.length] : 'var(--accent)';
          const IconComp = CATEGORY_ICONS[item.category] || FiMoreHorizontal;
          return (
            <motion.div
              key={item.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
            >
              <div className="timeline-icon" style={{ background: `${color}18`, color }}>
                <IconComp size={15} />
              </div>
              <div className="timeline-body">
                <span className="timeline-title">{item.title}</span>
                <span className="timeline-meta">{item.category} &middot; {formatDate(item.expense_date)}</span>
              </div>
              <span className="timeline-amount">-${Number(item.amount).toFixed(2)}</span>
            </motion.div>
          );
        })}
      </div>
    </ChartCard>
  );
}
