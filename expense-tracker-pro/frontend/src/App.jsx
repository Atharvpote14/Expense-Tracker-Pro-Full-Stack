import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ToastProvider, useToast } from './components/Toast';
import { expenseService } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ExpenseForm from './components/ExpenseForm';
import { FiPlus } from 'react-icons/fi';

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const addToast = useToast();
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const openAddExpense = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      await expenseService.create(formData);
      addToast('Expense added successfully', 'success');
      setShowForm(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add expense', 'error');
    }
  }, [addToast]);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onMenuToggle={() => setSidebarOpen(prev => !prev)}
      />
      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard onAddExpense={openAddExpense} />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={
              <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            } />
          </Routes>
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} ExpenseTracker Pro. Built with React, Express &amp; Neon PostgreSQL.</p>
          </footer>
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={openAddExpense} title="Add Expense">
        <FiPlus />
      </button>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={null}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}
