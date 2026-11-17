import './Navbar.css';

function Navbar({ onAddClick, onManageCategories, onExportCSV, theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-greeting">Good day 👋</span>
        <h1 className="topbar-title">Dashboard</h1>
      </div>

      <div className="topbar-actions">
        {/* Theme toggle */}
        <button
          className="topbar-btn topbar-btn--icon"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '🌙'}
        </button>

        {/* Export CSV */}
        <button className="topbar-btn" onClick={onExportCSV} title="Export CSV">
          <span>⬇</span> Export
        </button>

        {/* Categories */}
        <button className="topbar-btn" onClick={onManageCategories}>
          <span>◈</span> Categories
        </button>

        {/* Add Expense – primary CTA */}
        <button className="topbar-btn topbar-btn--primary" onClick={onAddClick}>
          <span>＋</span> Add Expense
        </button>
      </div>
    </header>
  );
}

export default Navbar;
