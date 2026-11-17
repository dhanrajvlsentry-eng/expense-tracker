/**
 * dateHelpers.js – shared date utility functions used across analytics components.
 */

/** Returns "YYYY-MM" string for a given Date object */
export function toYearMonth(date) {
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

/** Returns "YYYY-MM" string from an expense's date field ("YYYY-MM-DD") */
export function expenseYearMonth(expense) {
  return expense.date.slice(0, 7); // "YYYY-MM"
}

/** Given "YYYY-MM", returns a Date at the first day of that month */
export function parseYearMonth(ym) {
  const [yyyy, mm] = ym.split('-');
  return new Date(Number(yyyy), Number(mm) - 1, 1);
}

/** Short label for a "YYYY-MM" string, e.g. "Nov '26" */
export function shortMonthLabel(ym) {
  const d = parseYearMonth(ym);
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
}

/**
 * Returns the last N "YYYY-MM" strings ending with the current month.
 * E.g. last6Months() for Nov 2026 → ["Jun '26", …, "Nov '26"]
 */
export function lastNMonthKeys(n) {
  const result = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(toYearMonth(d));
  }
  return result;
}
