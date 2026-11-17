import './ExpenseTable.css';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [yyyy, mm, dd] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${dd} ${months[parseInt(mm, 10) - 1]} ${yyyy}`;
}

function formatAmount(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Lighten a hex colour for the tag background.
 * Returns { bg, text } style values.
 */
function categoryStyle(color) {
  // Parse hex -> rgba with low opacity for bg, solid for text
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    color: color,
    border: `1px solid rgba(${r}, ${g}, ${b}, 0.35)`,
  };
}

/**
 * ExpenseTable
 *
 * Props:
 *   expenses    – array of expense objects
 *   categories  – array of category objects { id, name, color }
 *   onDelete(id)
 *   onEdit(expense)
 */
function ExpenseTable({ expenses, categories, onDelete, onEdit }) {
  // Build a lookup: category name -> color
  const colorMap = {};
  categories.forEach((c) => { colorMap[c.name] = c.color; });

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🧾</div>
        <p className="empty-title">No expenses yet</p>
        <p className="empty-sub">
          Click <strong>Add Expense</strong> to record your first one.
        </p>
      </div>
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  function handleDelete(expense) {
    const confirmed = window.confirm(
      `Delete this expense?\n\n` +
      `Category: ${expense.category}\n` +
      `Amount: ${formatAmount(expense.amount)}\n` +
      `Date: ${formatDate(expense.date)}`
    );
    if (confirmed) onDelete(expense.id);
  }

  return (
    <div className="table-wrapper">
      <div className="table-header-row">
        <h2 className="table-title">All Expenses</h2>
        <span className="total-badge">Total: {formatAmount(total)}</span>
      </div>

      <div className="table-scroll">
        <table className="expense-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => {
              const catColor = colorMap[expense.category] || '#64748b';
              const tagStyle = categoryStyle(catColor);

              return (
                <tr key={expense.id} className="expense-row">
                  <td className="col-index">{index + 1}</td>
                  <td className="col-date">{formatDate(expense.date)}</td>
                  <td className="col-category">
                    <span className="category-tag" style={tagStyle}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="col-note">
                    {expense.note ? (
                      <span title={expense.note}>{expense.note}</span>
                    ) : (
                      <span className="note-empty">—</span>
                    )}
                  </td>
                  <td className="col-amount">{formatAmount(expense.amount)}</td>
                  <td className="col-action">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(expense)}
                      aria-label={`Edit expense: ${expense.category}`}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(expense)}
                      aria-label={`Delete expense: ${expense.category}`}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;
