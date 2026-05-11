import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MONTHS, filterByMonth, formatCurrency } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import './Page.css';

const EMPTY = {
  date:        dayjs().format('YYYY-MM-DD'),
  purpose:     '',
  bankCharges: '',
  amount:      '',
  approvedBy:  '',
};

export default function Expenses() {
  const { data, updateData } = useData();
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [selectedMonth, setMonth] = useState('all');
  const [error, setError]         = useState('');
  const [deleteId, setDeleteId]   = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.purpose || !form.amount) {
      setError('Date, Purpose, and Amount are required.');
      return;
    }

    const record = {
      id:          editId || uuidv4(),
      date:        form.date,
      purpose:     form.purpose.trim(),
      bankCharges: parseFloat(form.bankCharges) || 0,
      amount:      parseFloat(form.amount)      || 0,
      approvedBy:  form.approvedBy.trim(),
    };

    const newExpenses = editId
      ? data.expenses.map(r => (r.id === editId ? record : r))
      : [...data.expenses, record];

    updateData({ ...data, expenses: newExpenses });
    setForm(EMPTY);
    setEditId(null);
    setError('');
  }

  function handleEdit(record) {
    setForm({
      date:        record.date,
      purpose:     record.purpose,
      bankCharges: record.bankCharges.toString(),
      amount:      record.amount.toString(),
      approvedBy:  record.approvedBy,
    });
    setEditId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id) {
    updateData({ ...data, expenses: data.expenses.filter(r => r.id !== id) });
    setDeleteId(null);
  }

  const displayed = selectedMonth === 'all'
    ? data.expenses
    : filterByMonth(data.expenses, selectedMonth);

  const sorted = [...displayed].sort((a, b) => b.date.localeCompare(a.date));

  const totalAmount  = sorted.reduce((acc, r) => acc + r.amount, 0);
  const totalCharges = sorted.reduce((acc, r) => acc + r.bankCharges, 0);

  return (
    <div className="page entry-page expenses-page">
      <div className="page-header">
        <h1>Expenses</h1>
        <p>Record all church expenditure</p>
      </div>

      {/* ── Form ───────────────────────────────────────────────── */}
      <div className="card entry-form-card">
        <h2>{editId ? 'Edit Expense' : 'Add Expense'}</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="entry-form expense-entry-form">
          <div className="entry-fields-panel expense-fields-panel">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>

            <div className="form-group purpose-field">
              <label>Purpose *</label>
              <input
                type="text"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="e.g. Electricity bill"
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Charges (R)</label>
              <input
                type="number"
                name="bankCharges"
                value={form.bankCharges}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Amount (R) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group approved-field">
              <label>Approved By</label>
              <input
                type="text"
                name="approvedBy"
                value={form.approvedBy}
                onChange={handleChange}
                placeholder="Pastor / Treasurer"
              />
            </div>
          </div>

          <div className="entry-confirm-panel expense-confirm-panel">
            <p className="confirm-label">Entry total</p>
            <strong className="confirm-total">{formatCurrency((parseFloat(form.amount) || 0) + (parseFloat(form.bankCharges) || 0))}</strong>
            <span className="computed-hint">Amount plus bank charges.</span>

            <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update Expense' : 'Save Expense'}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setForm(EMPTY); setEditId(null); setError(''); }}
              >
                Cancel
              </button>
            )}
            </div>
          </div>
        </form>
      </div>

      {/* ── List ───────────────────────────────────────────────── */}
      <div className="card records-card">
        <div className="card-header-row">
          <h2>Expense Records</h2>
          <select
            value={selectedMonth}
            onChange={e => setMonth(e.target.value)}
            className="month-select"
          >
            <option value="all">All Months</option>
            {MONTHS.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>

        {sorted.length === 0 ? (
          <p className="empty-state">No expense records yet. Add one above.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Purpose</th>
                  <th>Bank Charges</th>
                  <th>Amount</th>
                  <th>Approved By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(r => (
                  <tr key={r.id}>
                    <td>{dayjs(r.date).format('DD MMM YYYY')}</td>
                    <td>{r.purpose}</td>
                    <td>{formatCurrency(r.bankCharges)}</td>
                    <td className="total-cell">{formatCurrency(r.amount)}</td>
                    <td>{r.approvedBy || '—'}</td>
                    <td>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(r)}
                        title="Edit"
                        aria-label="Edit expense record"
                      >
                        <Pencil aria-hidden="true" strokeWidth={2.4} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => setDeleteId(r.id)}
                        title="Delete"
                        aria-label="Delete expense record"
                      >
                        <Trash2 aria-hidden="true" strokeWidth={2.4} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan={2}><strong>Total</strong></td>
                  <td className="expense-cell">
                    <strong>{formatCurrency(totalCharges)}</strong>
                  </td>
                  <td className="expense-cell">
                    <strong>{formatCurrency(totalAmount)}</strong>
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete modal ────────────────────────────────────────── */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this expense record? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
