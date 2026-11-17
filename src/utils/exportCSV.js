/**
 * exportCSV.js – utility to export an expenses array as a CSV file download.
 *
 * Handles:
 *  - Proper header row
 *  - Notes that contain commas or double-quotes (RFC 4180 compliant)
 *  - Unicode / rupee symbol in amount
 */

/** Wraps a cell value in quotes if it contains commas, quotes or newlines */
function csvCell(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    // Escape existing double-quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * exportExpensesCSV(expenses)
 * Triggers a browser download of "expenses.csv".
 */
export function exportExpensesCSV(expenses) {
  const headers = ['ID', 'Amount (INR)', 'Category', 'Date', 'Note'];
  const rows = expenses.map((e) => [
    csvCell(e.id),
    csvCell(e.amount),
    csvCell(e.category),
    csvCell(e.date),
    csvCell(e.note),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Create a downloadable Blob and trigger click
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = 'expenses.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
