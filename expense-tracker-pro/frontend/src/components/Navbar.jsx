import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiBell, FiSun, FiMoon, FiMenu,
  FiSettings, FiDownload, FiLogOut, FiGrid,
  FiCheckCircle, FiAlertTriangle, FiInfo
} from 'react-icons/fi';

const notifications = [
  { id: 1, text: 'Expense added successfully', time: '2 min ago', type: 'success' },
  { id: 2, text: 'Monthly report ready for review', time: '1 hour ago', type: 'info' },
  { id: 3, text: 'Budget limit exceeded this month', time: '3 hours ago', type: 'warning' },
  { id: 4, text: 'Data backup completed', time: '1 day ago', type: 'success' },
];

const notifIcons = {
  success: <FiCheckCircle />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
};

export default function Navbar({ darkMode, toggleDarkMode, onMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [dateStr, setDateStr] = useState('');
  const [shortcutText, setShortcutText] = useState('Ctrl+K');
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const d = new Date();
    setDateStr(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    setShortcutText(navigator.platform.includes('Mac') ? '\u2318K' : 'Ctrl+K');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/expenses?search=${encodeURIComponent(q)}` : '/expenses');
    setMobileSearchOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button className="menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
            <FiMenu />
          </button>
          <div className="navbar-brand">
            <div className="brand-logo" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="22" fill="url(#brandGrad)" />
                <rect x="3" y="3" width="94" height="94" rx="19" fill="url(#brandGrad2)" opacity="0.5" />
                <path d="M50 22C44.5 22 40 26.5 40 32v4h-6a3 3 0 00-3 3v30a3 3 0 003 3h32a3 3 0 003-3V39a3 3 0 00-3-3h-6v-4c0-5.5-4.5-10-10-10zm-6 14V32a6 6 0 0112 0v4h-12zm8 20v8h-4v-8h-6l8-10 8 10h-6z" fill="white" />
                <defs>
                  <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6C63FF" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="brandGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C73FF" />
                    <stop offset="100%" stopColor="#9B6CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text-wrap">
              <span className="brand-text">ExpenseTracker</span>
              <span className="brand-pro-badge">Pro</span>
            </div>
          </div>
        </div>

        <div className="navbar-center">
          <form className={`navbar-search-wrap${searchFocused ? ' focused' : ''}`} onSubmit={handleSearchSubmit}>
            <FiSearch className="navbar-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="navbar-search"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              aria-label="Search expenses"
            />
            <kbd className="search-shortcut">{shortcutText}</kbd>
          </form>
        </div>

        <div className="navbar-right">
          <div className="navbar-date">{dateStr}</div>

          <motion.button
            className="theme-toggle"
            onClick={toggleDarkMode}
            whileTap={{ scale: 0.9 }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <motion.div
              key={darkMode ? 'sun' : 'moon'}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </motion.div>
          </motion.button>

          <div className="navbar-notif" ref={notifRef}>
            <motion.button
              className="notif-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={`Notifications (${notifications.length} unread)`}
              aria-expanded={notifOpen}
            >
              <FiBell />
              <span className="notif-badge">{notifications.length}</span>
              <span className="notif-dot" />
            </motion.button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  className="notif-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="dropdown-header">
                    <span className="dropdown-header-title">Notifications</span>
                    <span className="dropdown-badge">{notifications.length} new</span>
                  </div>
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <motion.div
                        key={n.id}
                        className={`notif-item notif-${n.type}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: n.id * 0.04 }}
                      >
                        <span className={`notif-item-icon notif-icon-${n.type}`}>
                          {notifIcons[n.type]}
                        </span>
                        <div className="notif-item-content">
                          <span className="notif-item-text">{n.text}</span>
                          <span className="notif-item-time">{n.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button className="dropdown-footer-btn">View all notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="navbar-profile" ref={profileRef}>
            <motion.button
              className="profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="User profile"
              aria-expanded={profileOpen}
            >
              <div className="profile-avatar">
                <span>AP</span>
              </div>
            </motion.button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="dropdown-user">
                    <div className="dropdown-user-avatar">AP</div>
                    <div className="dropdown-user-info">
                      <span className="dropdown-user-name">Alex Parker</span>
                      <span className="dropdown-user-email">alex@example.com</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <motion.button
                    className="dropdown-item"
                    onClick={() => { navigate('/'); setProfileOpen(false); }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <FiGrid /> Dashboard
                  </motion.button>
                  <motion.button
                    className="dropdown-item"
                    onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <FiSettings /> Settings
                  </motion.button>
                  <motion.button
                    className="dropdown-item"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <FiDownload /> Export CSV
                  </motion.button>
                  <div className="dropdown-divider" />
                  <motion.button
                    className="dropdown-item dropdown-danger"
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <FiLogOut /> Logout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="mobile-search-toggle"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          aria-label="Toggle search"
        >
          <FiSearch />
        </button>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            className="navbar-mobile-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <FiSearch className="mobile-search-icon" />
              <input
                type="text"
                className="mobile-search-input"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                aria-label="Search expenses"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
