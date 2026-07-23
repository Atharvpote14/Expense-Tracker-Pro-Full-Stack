import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const numValue = parseFloat(value) || 0;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = Math.max(1, Math.floor(numValue / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= numValue) {
        setDisplay(numValue);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, duration / 60);
    return () => clearInterval(timer);
  }, [numValue]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      {suffix}
    </span>
  );
}

export default function StatCard({ title, value, icon, subtitle, color, prefix = '', suffix = '', decimals = 0, trend }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      style={{
        '--card-accent': color || 'var(--accent)',
        '--icon-bg': `${color || '#6C63FF'}18`,
        '--icon-color': color || 'var(--accent)',
      }}
    >
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">{title}</span>
        <span className="stat-card-value">
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </span>
        {trend && (
          <span className={`stat-card-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.label}
          </span>
        )}
        {subtitle && !trend && (
          <span className="stat-card-trend neutral">{subtitle}</span>
        )}
      </div>
    </motion.div>
  );
}
