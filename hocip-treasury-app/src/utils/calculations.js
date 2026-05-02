import dayjs from 'dayjs';

export const MONTHS = [
  { key: '2025-10', label: 'October 2025',   short: 'Oct 25' },
  { key: '2025-11', label: 'November 2025',  short: 'Nov 25' },
  { key: '2025-12', label: 'December 2025',  short: 'Dec 25' },
  { key: '2026-01', label: 'January 2026',   short: 'Jan 26' },
  { key: '2026-02', label: 'February 2026',  short: 'Feb 26' },
  { key: '2026-03', label: 'March 2026',     short: 'Mar 26' },
  { key: '2026-04', label: 'April 2026',     short: 'Apr 26' },
  { key: '2026-05', label: 'May 2026',       short: 'May 26' },
  { key: '2026-06', label: 'June 2026',      short: 'Jun 26' },
  { key: '2026-07', label: 'July 2026',      short: 'Jul 26' },
  { key: '2026-08', label: 'August 2026',    short: 'Aug 26' },
  { key: '2026-09', label: 'September 2026', short: 'Sep 26' },
];

export function getMonthKey(dateStr) {
  return dayjs(dateStr).format('YYYY-MM');
}

export function filterByMonth(records, monthKey) {
  return records.filter(r => getMonthKey(r.date) === monthKey);
}

export function sumField(records, field) {
  return records.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
}

export function getMonthlyTotals(income, expenses) {
  return MONTHS.map(m => {
    const monthIncome   = filterByMonth(income, m.key);
    const monthExpenses = filterByMonth(expenses, m.key);
    const totalIncome   = sumField(monthIncome, 'totalPaid');
    const totalExpenses = sumField(monthExpenses, 'amount') + sumField(monthExpenses, 'bankCharges');
    return {
      ...m,
      tithes:        sumField(monthIncome, 'tithes'),
      offerings:     sumField(monthIncome, 'offerings'),
      pledges:       sumField(monthIncome, 'pledges'),
      bankInterest:  sumField(monthIncome, 'bankInterest'),
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  });
}

export function formatCurrency(val) {
  const n = parseFloat(val) || 0;
  return `R ${n.toFixed(2)}`;
}
