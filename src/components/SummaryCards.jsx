import './SummaryCards.css';
import { toYearMonth, expenseYearMonth } from '../utils/dateHelpers';

function fmt(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

function SummaryCards({ expenses, categories }) {
  // ── All-time totals ───────────────────────────────────────────────────────
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;

  // ── Monthly summary ───────────────────────────────────────────────────────
  const now         = new Date();
  const thisMonth   = toYearMonth(now);
  const prevDate    = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth   = toYearMonth(prevDate);

  const thisMonthTotal = expenses
    .filter((e) => expenseYearMonth(e) === thisMonth)
    .reduce((s, e) => s + e.amount, 0);

  const prevMonthTotal = expenses
    .filter((e) => expenseYearMonth(e) === prevMonth)
    .reduce((s, e) => s + e.amount, 0);

  // Percentage change vs previous month
  let pctChange     = null;
  let pctLabel      = '';
  let pctPositive   = true; // spending more = red-ish, less = green-ish

  if (prevMonthTotal > 0) {
    pctChange   = ((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
    pctPositive = pctChange >= 0;
    pctLabel    = `${pctPositive ? '▲' : '▼'} ${Math.abs(pctChange).toFixed(1)}% vs last month`;
  } else if (thisMonthTotal > 0) {
    pctLabel = '✦ First month of spending';
  } else {
    pctLabel = 'No spending this month';
  }

  // ── Top category ──────────────────────────────────────────────────────────
  const catTotals = {};
  expenses.forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const topCatEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  const topCatColor = topCatEntry
    ? (categories.find((c) => c.name === topCatEntry[0])?.color || '#4f46e5')
    : '#4f46e5';

  return (
    <div className="summary-grid">
      {/* Total Spent */}
      <div className="summary-card card-blue">
        <div className="card-icon">💸</div>
        <div className="card-body">
          <span className="card-label">Total Spent</span>
          <span className="card-value">{fmt(total)}</span>
          <span className="card-sub">{count} transaction{count !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* This Month */}
      <div className="summary-card card-slate">
        <div className="card-icon">📅</div>
        <div className="card-body">
          <span className="card-label">This Month</span>
          <span className="card-value">{fmt(thisMonthTotal)}</span>
          <span className={`card-sub ${pctPositive ? 'pct-up' : 'pct-down'}`}>
            {pctLabel}
          </span>
        </div>
      </div>

      {/* Top Category */}
      <div
        className="summary-card"
        style={{
          background: topCatEntry
            ? `linear-gradient(135deg, ${topCatColor}cc, ${topCatColor})`
            : 'linear-gradient(135deg, #312e81, #4f46e5)',
        }}
      >
        <div className="card-icon">🏆</div>
        <div className="card-body">
          <span className="card-label">Top Category</span>
          <span className="card-value card-value--sm">
            {topCatEntry ? topCatEntry[0] : '—'}
          </span>
          <span className="card-sub">
            {topCatEntry ? fmt(topCatEntry[1]) : 'No data yet'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
