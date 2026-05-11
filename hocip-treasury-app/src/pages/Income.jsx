import { useState } from 'react';
import { useData } from '../context/DataContext';
import { MONTHS, filterByMonth, formatCurrency } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import './Page.css';

const EMPTY = {
  date:         dayjs().format('YYYY-MM-DD'),
  receiptNo:    '',
  name:         '',
  tithes:       '',
  offerings:    '',
  pledges:      '',
  bankInterest: '',
};

export default function Income() {
  const { data, updateData } = useData();
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [selectedMonth, setMonth] = useState('all');
  const [error, setError]         = useState('');
  const [deleteId, setDeleteId]   = useState(null);

  // Live computed total from sub-fields
  const computed =
    (parseFloat(form.tithes)       || 0) +
    (parseFloat(form.offerings)    || 0) +
    (parseFloat(form.pledges)      || 0) +
    (parseFloat(form.bankInterest) || 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.name) {
      setError('Date and Name are required.');
      return;
    }
    const record = {
      id:           editId || uuidv4(),
      date:         form.date,
      receiptNo:    form.receiptNo.trim(),
      name:         form.name.trim(),
      tithes:       parseFloat(form.tithes)       || 0,
      offerings:    parseFloat(form.offerings)    || 0,
      pledges:      parseFloat(form.pledges)      || 0,
      bankInterest: parseFloat(form.bankInterest) || 0,
      totalPaid:    computed,
    };

    const newIncome = editId
      ? data.income.map(r => (r.id === editId ? record : r))
      : [...data.income, record];

    updateData({ ...data, income: newIncome });
    setForm(EMPTY);
    setEditId(null);
    setError('');
  }

  function handleEdit(record) {
    setForm({
      date:         record.date,
      receiptNo:    record.receiptNo,
      name:         record.name,
      tithes:       record.tithes.toString(),
      offerings:    record.offerings.toString(),
      pledges:      record.pledges.toString(),
      bankInterest: record.bankInterest.toString(),
    });
    setEditId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(id) {
    updateData({ ...data, income: data.income.filter(r => r.id !== id) });
    setDeleteId(null);
  }

  const displayed = selectedMonth === 'all'
    ? data.income
    : filterByMonth(data.income, selectedMonth);

  const sorted = [...displayed].sort((a, b) => b.date.localeCompare(a.date));

  const totalDisplayed = sorted.reduce((acc, r) => acc + r.totalPaid, 0);

  return (
    <div className="page entry-page income-page">
      <div className="page-header">
        <h1>Income</h1>
        <p>Record tithes, offerings, pledges and bank interest</p>
      </div>

      {/* ── Form ───────────────────────────────────────────────── */}
      <div className="card entry-form-card">
        <h2>{editId ? 'Edit Record' : 'Add Income'}</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="entry-form income-entry-form">
          <div className="entry-fields-panel income-fields-panel">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Receipt No.</label>
              <input
                type="text"
                name="receiptNo"
                value={form.receiptNo}
                onChange={handleChange}
                placeholder="e.g. 001"
              />
            </div>

            <div className="form-group name-field">
              <label>Name (Contributor) *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Tithes (R)</label>
              <input
                type="number"
                name="tithes"
                value={form.tithes}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Offerings (R)</label>
              <input
                type="number"
                name="offerings"
                value={form.offerings}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Pledges (R)</label>
              <input
                type="number"
                name="pledges"
                value={form.pledges}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Bank Interest (R)</label>
              <input
                type="number"
                name="bankInterest"
                value={form.bankInterest}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="entry-confirm-panel">
            <p className="confirm-label">Entry total</p>
            <strong className="confirm-total">{formatCurrency(computed)}</strong>
            <span className="computed-hint">Calculated from category amounts.</span>

            <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editId ? 'Update Record' : 'Save Income'}
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
          <h2>Income Records</h2>
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
          <p className="empty-state">No income records yet. Add one above.</p>
        ) : (
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
                  <th>Total Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(r => (
                  <tr key={r.id}>
                    <td>{dayjs(r.date).format('DD MMM YYYY')}</td>
                    <td>{r.receiptNo || '—'}</td>
                    <td>{r.name}</td>
                    <td>{formatCurrency(r.tithes)}</td>
                    <td>{formatCurrency(r.offerings)}</td>
                    <td>{formatCurrency(r.pledges)}</td>
                    <td>{formatCurrency(r.bankInterest)}</td>
                    <td className="total-cell">{formatCurrency(r.totalPaid)}</td>
                    <td>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(r)}
                        title="Edit"
                        aria-label="Edit income record"
                      >
                        <Pencil aria-hidden="true" strokeWidth={2.4} />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => setDeleteId(r.id)}
                        title="Delete"
                        aria-label="Delete income record"
                      >
                        <Trash2 aria-hidden="true" strokeWidth={2.4} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan={7}><strong>Total</strong></td>
                  <td className="income-cell">
                    <strong>{formatCurrency(totalDisplayed)}</strong>
                  </td>
                  <td />
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
            <p>Are you sure you want to delete this income record? This cannot be undone.</p>
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
