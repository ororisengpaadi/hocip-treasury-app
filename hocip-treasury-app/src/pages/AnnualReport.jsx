import { useData } from '../context/DataContext';
import { getMonthlyTotals, formatCurrency } from '../utils/calculations';
import { exportToExcel } from '../utils/excelExport';
import './Page.css';

export default function AnnualReport() {
  const { data } = useData();
  const monthly = getMonthlyTotals(data.income, data.expenses);

  let running = 0;
  const rows = monthly.map(m => {
    running += m.balance;
    return { ...m, runningBalance: running };
  });

  const totalIncome   = rows.reduce((acc, r) => acc + r.totalIncome,   0);
  const totalExpenses = rows.reduce((acc, r) => acc + r.totalExpenses, 0);
  const yearBalance   = totalIncome - totalExpenses;

  return (
    <div className="page annual-page">
      <div className="page-header">
        <h1>Annual Report</h1>
        <p>Financial Year October 2025 — September 2026</p>
        <button className="btn btn-primary header-action" onClick={() => exportToExcel(data)}>
          Export to Excel
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table annual-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Tithes</th>
                <th>Offerings</th>
                <th>Pledges</th>
                <th>Bank Interest</th>
                <th>Total Income</th>
                <th>Total Expenses</th>
                <th>Monthly Balance</th>
                <th>Running Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.key} className={r.balance < 0 ? 'row-deficit' : ''}>
                  <td><strong>{r.label}</strong></td>
                  <td>{formatCurrency(r.tithes)}</td>
                  <td>{formatCurrency(r.offerings)}</td>
                  <td>{formatCurrency(r.pledges)}</td>
                  <td>{formatCurrency(r.bankInterest)}</td>
                  <td className="income-cell">{formatCurrency(r.totalIncome)}</td>
                  <td className="expense-cell">{formatCurrency(r.totalExpenses)}</td>
                  <td className={r.balance >= 0 ? 'income-cell' : 'expense-cell'}>
                    {formatCurrency(r.balance)}
                  </td>
                  <td className={r.runningBalance >= 0 ? 'income-cell' : 'expense-cell'}>
                    <strong>{formatCurrency(r.runningBalance)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td><strong>YEAR TOTAL</strong></td>
                <td colSpan={4} />
                <td className="income-cell">
                  <strong>{formatCurrency(totalIncome)}</strong>
                </td>
                <td className="expense-cell">
                  <strong>{formatCurrency(totalExpenses)}</strong>
                </td>
                <td className={yearBalance >= 0 ? 'income-cell' : 'expense-cell'}>
                  <strong>{formatCurrency(yearBalance)}</strong>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
