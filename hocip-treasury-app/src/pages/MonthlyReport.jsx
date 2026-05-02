import { useState } from 'react';
import { useData } from '../App';
import { MONTHS, filterByMonth, sumField, formatCurrency } from '../utils/calculations';
import dayjs from 'dayjs';
import './Page.css';

export default function MonthlyReport() {
  const { data } = useData();

  // Default to the current month if it is within the financial year, otherwise first month
  const currentKey  = dayjs().format('YYYY-MM');
  const defaultKey  = MONTHS.find(m => m.key === currentKey)?.key || MONTHS[0].key;
  const [selectedMonth, setSelected] = useState(defaultKey);

  const monthLabel = MONTHS.find(m => m.key === selectedMonth)?.label || '';
  const income     = filterByMonth(data.income,   selectedMonth);
  const expenses   = filterByMonth(data.expenses, selectedMonth);

  const tithes       = sumField(income, 'tithes');
  const offerings    = sumField(income, 'offerings');
  const pledges      = sumField(income, 'pledges');
  const bankInterest = sumField(income, 'bankInterest');
  const totalIncome  = sumField(income, 'totalPaid');

  const totalExpenses =
    sumField(expenses, 'amount') + sumField(expenses, 'bankCharges');

  const balance = totalIncome - totalExpenses;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📅 Monthly Report</h1>
        <p>Detailed breakdown for any selected month</p>
        <select
          value={selectedMonth}
          onChange={e => setSelected(e.target.value)}
          className="month-select"
          style={{ marginLeft: 'auto' }}
        >
          {MONTHS.map(m => (
            <option key={m.key} value={m.key}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <h2>{monthLabel}</h2>

        {/* Income summary */}
        <div className="report-section">
          <h3 className="section-title income-title">💰 Income Breakdown</h3>
          <table className="report-table">
            <tbody>
              <tr><td>Tithes</td>       <td>{formatCurrency(tithes)}</td></tr>
              <tr><td>Offerings</td>    <td>{formatCurrency(offerings)}</td></tr>
              <tr><td>Pledges</td>      <td>{formatCurrency(pledges)}</td></tr>
              <tr><td>Bank Interest</td><td>{formatCurrency(bankInterest)}</td></tr>
              <tr className="subtotal-row">
                <td><strong>Total Income</strong></td>
                <td><strong>{formatCurrency(totalIncome)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense summary */}
        <div className="report-section">
          <h3 className="section-title expense-title">📤 Expense Breakdown</h3>
          {expenses.length === 0 ? (
            <p className="empty-state">No expenses recorded for this month.</p>
          ) : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Bank Charges</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(r => (
                  <tr key={r.id}>
                    <td>{r.purpose}</td>
                    <td>{formatCurrency(r.bankCharges)}</td>
                    <td>{formatCurrency(r.amount)}</td>
                  </tr>
                ))}
                <tr className="subtotal-row">
                  <td colSpan={2}><strong>Total Expenses</strong></td>
                  <td><strong>{formatCurrency(totalExpenses)}</strong></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Balance banner */}
        <div className={`balance-banner ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span>Monthly Balance</span>
          <strong>{formatCurrency(balance)}</strong>
        </div>

        {/* Full income transaction detail */}
        {income.length > 0 && (
          <div className="report-section" style={{ marginTop: 28 }}>
            <h3 className="section-title">Income Transaction Details</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Name</th>
                    <th>Tithes</th>
                    <th>Offerings</th>
                    <th>Pledges</th>
                    <th>Interest</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {income.map(r => (
                    <tr key={r.id}>
                      <td>{dayjs(r.date).format('DD MMM YYYY')}</td>
                      <td>{r.receiptNo || '—'}</td>
                      <td>{r.name}</td>
                      <td>{formatCurrency(r.tithes)}</td>
                      <td>{formatCurrency(r.offerings)}</td>
                      <td>{formatCurrency(r.pledges)}</td>
                      <td>{formatCurrency(r.bankInterest)}</td>
                      <td className="income-cell">{formatCurrency(r.totalPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
