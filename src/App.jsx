import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import SummaryCards from './components/SummaryCards';
import CategoryManager from './components/CategoryManager';
import CategoryPieChart from './components/CategoryPieChart';
import MonthlyBarChart from './components/MonthlyBarChart';
import useLocalStorage from './hooks/useLocalStorage';
import { DEFAULT_CATEGORIES } from './data/defaultCategories';
import { exportExpensesCSV } from './utils/exportCSV';
import './App.css';

function App() {
  // ── Persisted state ──────────────────────────────────────────────────────
  const [expenses,   setExpenses]   = useLocalStorage('et_expenses',   []);
  const [categories, setCategories] = useLocalStorage('et_categories', DEFAULT_CATEGORIES);

  // ── UI / layout state ────────────────────────────────────────────────────
  const [showForm,            setShowForm]            = useState(false);
  const [editingExpense,      setEditingExpense]      = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [sidebarCollapsed,    setSidebarCollapsed]    = useState(false);
  const [activeSection,       setActiveSection]       = useState('dashboard');

  // ── Theme ────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage('et_theme', 'dark');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  // ── Expense handlers ─────────────────────────────────────────────────────
  function handleAddExpense(newExpense) {
    setExpenses((prev) => [newExpense, ...prev]);
  }
  function handleEditExpense(updated) {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditingExpense(null);
  }
  function handleDeleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }
  function openEdit(expense) {
    setEditingExpense(expense);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditingExpense(null);
  }

  // ── Category handlers ────────────────────────────────────────────────────
  function handleAddCategory(cat) {
    setCategories((prev) => [...prev, cat]);
  }
  function handleEditCategory(updated) {
    const original = categories.find((c) => c.id === updated.id);
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (original && original.name !== updated.name) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.category === original.name ? { ...e, category: updated.name } : e
        )
      );
    }
  }
  function handleDeleteCategory(id, reassignTo) {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    if (reassignTo) {
      setExpenses((prev) =>
        prev.map((e) =>
          e.category === target.name ? { ...e, category: reassignTo } : e
        )
      );
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  // ── CSV Export ───────────────────────────────────────────────────────────
  function handleExportCSV() {
    if (expenses.length === 0) {
      alert('No expenses to export yet.');
      return;
    }
    exportExpensesCSV(expenses);
  }

  // ── Section navigation helpers ───────────────────────────────────────────
  function handleNavigate(section) {
    setActiveSection(section);
    if (section === 'categories') setShowCategoryManager(true);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`app-shell app-shell--${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="app-body">
        <Navbar
          onAddClick={() => { setEditingExpense(null); setShowForm(true); }}
          onManageCategories={() => { setShowCategoryManager(true); setActiveSection('categories'); }}
          onExportCSV={handleExportCSV}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="main-content">
          <div className="dashboard-container">

            {/* Summary cards */}
            <SummaryCards expenses={expenses} categories={categories} />

            {/* Charts */}
            <div className="charts-row">
              <CategoryPieChart expenses={expenses} categories={categories} />
              <MonthlyBarChart  expenses={expenses} />
            </div>

            {/* Expense table */}
            <ExpenseTable
              expenses={expenses}
              categories={categories}
              onDelete={handleDeleteExpense}
              onEdit={openEdit}
            />
          </div>
        </main>
      </div>

      {/* Modals */}
      {showForm && (
        <ExpenseForm
          categories={categories}
          expenseToEdit={editingExpense}
          onAdd={handleAddExpense}
          onEdit={handleEditExpense}
          onClose={closeForm}
        />
      )}
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          expenses={expenses}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onClose={() => { setShowCategoryManager(false); setActiveSection('dashboard'); }}
        />
      )}
    </div>
  );
}

export default App;
