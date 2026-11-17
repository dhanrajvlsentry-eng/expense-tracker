import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '⬡' },
  { id: 'expenses',   label: 'Expenses',   icon: '↕' },
  { id: 'categories', label: 'Categories', icon: '◈' },
  { id: 'analytics',  label: 'Analytics',  icon: '◎' },
];

function Sidebar({ activeSection, onNavigate, collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">💰</div>
        {!collapsed && (
          <div className="brand-text">
            <span className="brand-name">FinTrack</span>
            <span className="brand-sub">Expense Manager</span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item${activeSection === item.id ? ' nav-item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
            title={collapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {activeSection === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {collapsed ? '›' : '‹'}
      </button>
    </aside>
  );
}

export default Sidebar;
