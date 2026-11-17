import { useState, useEffect } from 'react';
import './ExpenseForm.css';

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * ExpenseForm – handles both "Add" and "Edit" modes.
 *
 * Props:
 *   categories     – array of category objects { id, name, color }
 *   expenseToEdit  – expense object when editing, null when adding
 *   onAdd(expense) – called with a new expense object
 *   onEdit(expense)– called with the updated expense object
 *   onClose()      – close the modal
 */
function ExpenseForm({ categories, expenseToEdit, onAdd, onEdit, onClose }) {
  const isEditing = expenseToEdit !== null && expenseToEdit !== undefined;

  const [form, setForm] = useState({
    amount:   isEditing ? String(expenseToEdit.amount) : '',
    category: isEditing ? expenseToEdit.category : '',
    date:     isEditing ? expenseToEdit.date : getTodayDate(),
    note:     isEditing ? expenseToEdit.note : '',
  });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function validate(data) {
    const errs = {};
    const amount = parseFloat(data.amount);
    if (!data.amount || isNaN(amount) || amount <= 0) {
      errs.amount = 'Amount must be a number greater than 0.';
    }
    if (!data.category) {
      errs.category = 'Please select a category.';
    }
    if (!data.date) {
      errs.date = 'Please select a date.';
    }
    if (data.note.length > 120) {
      errs.note = 'Note must be 120 characters or fewer.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (submitted) setErrors(validate(updated));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      id:       isEditing ? expenseToEdit.id : Date.now(),
      amount:   parseFloat(parseFloat(form.amount).toFixed(2)),
      category: form.category,
      date:     form.date,
      note:     form.note.trim(),
    };

    if (isEditing) {
      onEdit(payload);
    } else {
      onAdd(payload);
    }
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-header">
          <h2 id="form-title">{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="expense-form" onSubmit={handleSubmit} noValidate>
          {/* Amount */}
          <div className="form-group">
            <label htmlFor="ef-amount">Amount (₹) <span className="required">*</span></label>
            <input
              id="ef-amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className={errors.amount ? 'input-error' : ''}
            />
            {errors.amount && <span className="error-msg">{errors.amount}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="ef-category">Category <span className="required">*</span></label>
            <select
              id="ef-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={errors.category ? 'input-error' : ''}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <span className="error-msg">{errors.category}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="ef-date">Date <span className="required">*</span></label>
            <input
              id="ef-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>

          {/* Note */}
          <div className="form-group">
            <label htmlFor="ef-note">
              Note
              <span className="char-count"> ({form.note.length}/120)</span>
            </label>
            <textarea
              id="ef-note"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Brief description (optional, max 120 chars)"
              rows={3}
              maxLength={120}
              className={errors.note ? 'input-error' : ''}
            />
            {errors.note && <span className="error-msg">{errors.note}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
