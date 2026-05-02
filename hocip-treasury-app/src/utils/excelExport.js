import * as XLSX from 'xlsx';
import { getMonthlyTotals } from './calculations';
import dayjs from 'dayjs';

export function exportToExcel(data) {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Income transactions ──────────────────────────────
  const incomeRows = data.income
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({
      Date:            r.date,
      'Receipt No':    r.receiptNo || '',
      Name:            r.name,
      Tithes:          r.tithes,
      Offerings:       r.offerings,
      Pledges:         r.pledges,
      'Bank Interest': r.bankInterest,
      'Total Paid':    r.totalPaid,
    }));
  const wsIncome = XLSX.utils.json_to_sheet(incomeRows.length ? incomeRows : [{}]);
  XLSX.utils.book_append_sheet(wb, wsIncome, 'Income Transactions');

  // ── Sheet 2: Expense transactions ─────────────────────────────
  const expenseRows = data.expenses
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({
      Date:          r.date,
      Purpose:       r.purpose,
      'Bank Charges': r.bankCharges,
      Amount:        r.amount,
      'Approved By': r.approvedBy || '',
    }));
  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows.length ? expenseRows : [{}]);
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expense Transactions');

  // ── Sheet 3: Annual summary ────────────────────────────────────
  const monthly = getMonthlyTotals(data.income, data.expenses);
  let running = 0;
  const summaryRows = monthly.map(m => {
    running += m.balance;
    return {
      Month:             m.label,
      Tithes:            m.tithes,
      Offerings:         m.offerings,
      Pledges:           m.pledges,
      'Bank Interest':   m.bankInterest,
      'Total Income':    m.totalIncome,
      'Total Expenses':  m.totalExpenses,
      'Monthly Balance': m.balance,
      'Running Balance': running,
    };
  });
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Annual Summary');

  XLSX.writeFile(wb, `AFM_Treasury_Report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
}
