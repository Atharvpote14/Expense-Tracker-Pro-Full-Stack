import { NavLink } from 'react-router-dom';
import { FiHome, FiList, FiBarChart2, FiSettings, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', icon: <FiHome />, label: 'Dashboard' },
  { to: '/expenses', icon: <FiList />, label: 'Expenses' },
  { to: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
  { to: '/settings', icon: <FiSettings />, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="22" fill="url(#sideGradS)" />
              <text x="50" y="68" fontFamily="Inter, sans-serif" fontSize="48" fontWeight="700" fill="white" textAnchor="middle">$</text>
              <defs>
                <linearGradient id="sideGradS" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <span className="sidebar-brand-text">ExpenseTracker<span className="brand-pro">Pro</span></span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span className="sidebar-link-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="sidebar-version">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
