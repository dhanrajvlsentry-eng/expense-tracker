import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import './MonthlyBarChart.css';
import { expenseYearMonth, lastNMonthKeys, shortMonthLabel } from '../utils/dateHelpers';

/** Custom tooltip */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <span>₹{Number(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
    </div>
  );
}

/**
 * MonthlyBarChart
 *
 * Props:
 *   expenses – full expense array
 */
function MonthlyBarChart({ expenses }) {
  const monthKeys = lastNMonthKeys(6);

  // Aggregate expense totals per month key
  const chartData = useMemo(() => {
    const totals = {};
    expenses.forEach((e) => {
      const mk = expenseYearMonth(e);
      totals[mk] = (totals[mk] || 0) + e.amount;
    });
    return monthKeys.map((mk) => ({
      month: shortMonthLabel(mk),
      total: parseFloat((totals[mk] || 0).toFixed(2)),
      isCurrent: mk === monthKeys[monthKeys.length - 1],
    }));
  }, [expenses]); // eslint-disable-line react-hooks/exhaustive-deps

  const isEmpty = chartData.every((d) => d.total === 0);

  // Y-axis nice formatter
  function fmtY(v) {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${v}`;
  }

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-title">📈 Monthly Trend</h3>
        <span className="chart-subtitle">Last 6 months</span>
      </div>

      {isEmpty ? (
        <div className="chart-empty">
          <span>📊</span>
          <p>No expense data for the last 6 months</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmtY}
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,142,247,0.07)' }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={entry.isCurrent ? '#4f8ef7' : '#1e3a7a'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      <p className="bar-legend-note">
        <span style={{ display:'inline-block', width:10, height:10, borderRadius:3, background:'#4f8ef7', marginRight:5 }} />
        Current month &nbsp;
        <span style={{ display:'inline-block', width:10, height:10, borderRadius:3, background:'#1e3a7a', marginRight:5 }} />
        Previous months
      </p>
    </div>
  );
}

export default MonthlyBarChart;
