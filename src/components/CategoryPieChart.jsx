import { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import './CategoryPieChart.css';
import { expenseYearMonth, lastNMonthKeys, shortMonthLabel } from '../utils/dateHelpers';

/** Custom tooltip for the donut chart */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="chart-tooltip">
      <strong>{name}</strong>
      <span>₹{Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>
  );
}

/** Render the % label inside each slice */
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null; // hide tiny slices
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
          fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

/**
 * CategoryPieChart
 *
 * Props:
 *   expenses   – full expense array
 *   categories – full category array { id, name, color }
 */
function CategoryPieChart({ expenses, categories }) {
  // Build month options from last 6 months
  const monthKeys = lastNMonthKeys(6);
  const [selectedMonth, setSelectedMonth] = useState(monthKeys[monthKeys.length - 1]);

  // Build colorMap: name → hex
  const colorMap = useMemo(() => {
    const m = {};
    categories.forEach((c) => { m[c.name] = c.color; });
    return m;
  }, [categories]);

  // Filter expenses for selected month, then group by category
  const chartData = useMemo(() => {
    const filtered = expenses.filter((e) => expenseYearMonth(e) === selectedMonth);
    const totals = {};
    filtered.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, selectedMonth]);

  const isEmpty = chartData.length === 0;

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="chart-card-header">
        <h3 className="chart-title">📊 Category Breakdown</h3>
        <select
          className="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          aria-label="Select month"
        >
          {monthKeys.map((mk) => (
            <option key={mk} value={mk}>{shortMonthLabel(mk)}</option>
          ))}
        </select>
      </div>

      {isEmpty ? (
        <div className="chart-empty">
          <span>🍩</span>
          <p>No expenses for {shortMonthLabel(selectedMonth)}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={colorMap[entry.name] || '#64748b'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CategoryPieChart;
