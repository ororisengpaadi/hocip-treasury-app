import { useData } from '../App';
import { MONTHS, getMonthlyTotals, formatCurrency } from '../utils/calculations';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import './Page.css';

export default function Dashboard() {
  const { data } = useData();
  const monthlyTotals = getMonthlyTotals(data.income, data.expenses);

  // Find the current month within the financial year, or fall back to first month
  const currentMonthKey = dayjs().format('YYYY-MM');
  const currentMonth    = monthlyTotals.find(m => m.key === currentMonthKey) || monthlyTotals[0];

  const totalIncome   = data.income.reduce((acc, r) => acc + r.totalPaid, 0);
  const totalExpenses = data.expenses.reduce((acc, r) => acc + r.amount + r.bankCharges, 0);
  const yearBalance   = totalIncome - totalExpenses;

  const chartData = monthlyTotals.map(m => ({
    name:     m.short,
    Income:   parseFloat(m.totalIncome.toFixed(2)),
    Expenses: parseFloat(m.totalExpenses.toFixed(2)),
  }));

  const recentIncome   = [...data.income].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentExpenses = [...data.expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>AFM Dzingidzingi Throne of God — Financial Year 2025 / 2026</p>
      </div>

      {/* Summary cards */}
      <div className="cards-row">
        <div className="summary-card income-card">
          <div className="card-icon">💰</div>
          <div>
            <p className="card-label">Year-to-Date Income</p>
            <p className="card-value">{formatCurrency(totalIncome)}</p>
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="card-icon">📤</div>
          <div>
            <p className="card-label">Year-to-Date Expenses</p>
            <p className="card-value">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        <div className={`summary-card ${yearBalance >= 0 ? 'balance-card' : 'deficit-card'}`}>
          <div className="card-icon">{yearBalance >= 0 ? '✅' : '⚠️'}</div>
          <div>
            <p className="card-label">Year Balance</p>
            <p className="card-value">{formatCurrency(yearBalance)}</p>
          </div>
        </div>

        <div className="summary-card month-card">
          <div className="card-icon">📅</div>
          <div>
            <p className="card-label">{currentMonth.label} Balance</p>
            <p className="card-value">{formatCurrency(currentMonth.balance)}</p>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <h2>Income vs Expenses — Monthly Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eaecee" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `R${v}`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={value => [`R ${value.toFixed(2)}`]} />
            <Legend />
            <Bar dataKey="Income"   fill="#27ae60" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#e74c3c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent activity */}
      <div className="two-col">
        <div className="card">
          <h2>Recent Income</h2>
          {recentIncome.length === 0 ? (
            <p className="empty-state">No income recorded yet.</p>
          ) : (
            <table className="data-table compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentIncome.map(r => (
                  <tr key={r.id}>
                    <td>{dayjs(r.date).format('DD MMM')}</td>
                    <td>{r.name}</td>
                    <td className="income-cell">{formatCurrency(r.totalPaid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2>Recent Expenses</h2>
          {recentExpenses.length === 0 ? (
            <p className="empty-state">No expenses recorded yet.</p>
          ) : (
            <table className="data-table compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map(r => (
                  <tr key={r.id}>
                    <td>{dayjs(r.date).format('DD MMM')}</td>
                    <td>{r.purpose}</td>
                    <td className="expense-cell">{formatCurrency(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
