import { useState } from 'react';
import './ExpenseForm.css';   // shared modal + button base styles
import './CategoryManager.css';

// Palette of preset colours users can pick from
const COLOR_PALETTE = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e', '#64748b',
];

/**
 * CategoryManager modal.
 *
 * Props:
 *   categories  – array { id, name, color, isDefault }
 *   expenses    – full expense list (to detect in-use categories)
 *   onAdd({ id, name, color, isDefault:false })
 *   onEdit(updatedCategory)
 *   onDelete(id, reassignToName | null)
 *   onClose()
 */
function CategoryManager({ categories, expenses, onAdd, onEdit, onDelete, onClose }) {
  // Which category is being edited inline (by id), or null
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName]   = useState('');
  const [editColor, setEditColor] = useState('');
  const [editErr, setEditErr]     = useState('');

  // "Add new" form state
  const [newName, setNewName]   = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [newErr, setNewErr]     = useState('');
  const [showAdd, setShowAdd]   = useState(false);

  // Reassignment modal state
  const [deletingCat, setDeletingCat]       = useState(null); // category obj
  const [reassignTarget, setReassignTarget] = useState('');

  // ── Helper ────────────────────────────────────────────────────────────────
  function isNameTaken(name, excludeId = null) {
    return categories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase() && c.id !== excludeId
    );
  }

  function expensesUsing(catName) {
    return expenses.filter((e) => e.category === catName).length;
  }

  // ── Add ───────────────────────────────────────────────────────────────────
  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) { setNewErr('Category name is required.'); return; }
    if (isNameTaken(trimmed)) { setNewErr('A category with this name already exists.'); return; }
    setNewErr('');
    onAdd({
      id:        `cat-custom-${Date.now()}`,
      name:      trimmed,
      color:     newColor,
      isDefault: false,
    });
    setNewName('');
    setNewColor('#3b82f6');
    setShowAdd(false);
  }

  // ── Edit start ────────────────────────────────────────────────────────────
  function startEdit(cat) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
    setEditErr('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditErr('');
  }

  function saveEdit(cat) {
    const trimmed = editName.trim();
    if (!trimmed) { setEditErr('Name cannot be empty.'); return; }
    if (isNameTaken(trimmed, cat.id)) { setEditErr('Another category with this name exists.'); return; }
    setEditErr('');
    onEdit({ ...cat, name: trimmed, color: editColor });
    setEditingId(null);
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function requestDelete(cat) {
    const inUse = expensesUsing(cat.name);
    if (inUse > 0) {
      // Show reassignment prompt
      setDeletingCat(cat);
      setReassignTarget('');
    } else {
      if (window.confirm(`Delete category "${cat.name}"?`)) {
        onDelete(cat.id, null);
      }
    }
  }

  function confirmDeleteWithReassign() {
    if (!reassignTarget) return;
    onDelete(deletingCat.id, reassignTarget);
    setDeletingCat(null);
  }

  function confirmDeleteWithout() {
    // Should not normally be reachable if expenses exist, kept as safety
    onDelete(deletingCat.id, null);
    setDeletingCat(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card cm-card" role="dialog" aria-modal="true" aria-labelledby="cm-title">
        {/* Header */}
        <div className="modal-header">
          <h2 id="cm-title">🏷️ Manage Categories</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Category list */}
        <ul className="cm-list">
          {categories.map((cat) => {
            const inUse = expensesUsing(cat.name);
            const isEditing = editingId === cat.id;

            return (
              <li key={cat.id} className="cm-item">
                {isEditing ? (
                  /* ── Edit row ── */
                  <div className="cm-edit-row">
                    <input
                      className="cm-name-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name"
                      maxLength={40}
                      autoFocus
                    />
                    {/* Colour palette */}
                    <div className="cm-palette">
                      {COLOR_PALETTE.map((hex) => (
                        <button
                          key={hex}
                          className={`cm-swatch${editColor === hex ? ' selected' : ''}`}
                          style={{ background: hex }}
                          onClick={() => setEditColor(hex)}
                          aria-label={`Colour ${hex}`}
                          type="button"
                        />
                      ))}
                      {/* Custom colour picker */}
                      <input
                        type="color"
                        className="cm-color-picker"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        title="Custom colour"
                      />
                    </div>
                    {editErr && <span className="error-msg">{editErr}</span>}
                    <div className="cm-edit-actions">
                      <button className="btn-cancel cm-btn-sm" onClick={cancelEdit}>Cancel</button>
                      <button className="btn-submit cm-btn-sm" onClick={() => saveEdit(cat)}>Save</button>
                    </div>
                  </div>
                ) : (
                  /* ── Display row ── */
                  <div className="cm-display-row">
                    <span
                      className="cm-dot"
                      style={{ background: cat.color }}
                    />
                    <span className="cm-name">{cat.name}</span>
                    {inUse > 0 && (
                      <span className="cm-in-use">{inUse} expense{inUse > 1 ? 's' : ''}</span>
                    )}
                    <div className="cm-row-actions">
                      <button
                        className="btn-icon"
                        onClick={() => startEdit(cat)}
                        aria-label={`Edit ${cat.name}`}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        onClick={() => requestDelete(cat)}
                        aria-label={`Delete ${cat.name}`}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Add new category */}
        {showAdd ? (
          <div className="cm-add-panel">
            <input
              className="cm-name-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name"
              maxLength={40}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
            <div className="cm-palette">
              {COLOR_PALETTE.map((hex) => (
                <button
                  key={hex}
                  className={`cm-swatch${newColor === hex ? ' selected' : ''}`}
                  style={{ background: hex }}
                  onClick={() => setNewColor(hex)}
                  aria-label={`Colour ${hex}`}
                  type="button"
                />
              ))}
              <input
                type="color"
                className="cm-color-picker"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                title="Custom colour"
              />
            </div>
            {newErr && <span className="error-msg">{newErr}</span>}
            <div className="cm-edit-actions">
              <button className="btn-cancel cm-btn-sm" onClick={() => { setShowAdd(false); setNewErr(''); }}>
                Cancel
              </button>
              <button className="btn-submit cm-btn-sm" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        ) : (
          <button className="cm-add-btn" onClick={() => setShowAdd(true)}>
            ＋ Add New Category
          </button>
        )}
      </div>

      {/* Reassignment modal */}
      {deletingCat && (
        <div className="reassign-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="reassign-card">
            <h3>Category In Use</h3>
            <p>
              <strong>"{deletingCat.name}"</strong> is used by{' '}
              {expensesUsing(deletingCat.name)} expense(s).
              Reassign them before deleting:
            </p>
            <select
              value={reassignTarget}
              onChange={(e) => setReassignTarget(e.target.value)}
              className="reassign-select"
            >
              <option value="">-- Choose a category --</option>
              {categories
                .filter((c) => c.id !== deletingCat.id)
                .map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
            </select>
            <div className="reassign-actions">
              <button
                className="btn-cancel cm-btn-sm"
                onClick={() => setDeletingCat(null)}
              >
                Cancel
              </button>
              <button
                className="btn-submit cm-btn-sm"
                onClick={confirmDeleteWithReassign}
                disabled={!reassignTarget}
              >
                Reassign &amp; Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManager;
