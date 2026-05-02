import { useState, useRef } from 'react';
import { CATEGORIES, COLOR_OPTIONS, getCategoryEmoji } from '../../utils/recommendations';
import { useToast } from '../shared/ToastContext';

const SEASONS = ['all', 'spring', 'summer', 'autumn', 'winter'];
const OCCASIONS = ['Casual', 'Work', 'Formal', 'Party', 'Outdoor', 'Date', 'Sport'];

function AddItemModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', category: 'top', colors: [], season: 'all', occasions: [], brand: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const toggleColor = (color) => {
    setForm(f => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter(c => c !== color) : [...f.colors, color],
    }));
  };

  const toggleOccasion = (occ) => {
    setForm(f => ({
      ...f,
      occasions: f.occasions.includes(occ) ? f.occasions.filter(o => o !== occ) : [...f.occasions, occ],
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;
    setSaving(true);
    await onSave(form, imageFile);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>Add Clothing Item</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image Upload */}
          <div
            style={{
              width: '100%', height: '180px', borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--cream-darker)', background: 'var(--cream)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden', position: 'relative',
            }}
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--charcoal-muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                <div style={{ fontSize: '13px' }}>Click to upload photo</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Item Name *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="e.g. White Linen Shirt" required />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handle} placeholder="e.g. Zara" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handle} required>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Season</label>
              <select name="season" value={form.season} onChange={handle}>
                {SEASONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Colors</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value} type="button"
                  title={c.label}
                  onClick={() => toggleColor(c.value)}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: c.value,
                    border: form.colors.includes(c.value) ? '3px solid var(--terracotta)' : '2px solid rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    boxShadow: form.colors.includes(c.value) ? '0 0 0 2px white inset' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Occasions</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              {OCCASIONS.map(o => (
                <button key={o} type="button"
                  className={`filter-chip ${form.occasions.includes(o) ? 'active' : ''}`}
                  onClick={() => toggleOccasion(o)}>
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Wardrobe({ items, addItem, deleteItem, updateItem }) {
  const { addToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleSave = async (data, file) => {
    try {
      await addItem(data, file);
      addToast('Item added to wardrobe!', 'success');
    } catch (e) {
      addToast('Failed to add item: ' + e.message, 'error');
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await deleteItem(item);
      addToast('Item removed', 'info');
    } catch (e) {
      addToast('Failed to delete', 'error');
    }
  };

  const categories = ['all', ...new Set(items.map(i => i.category))];

  const filtered = items.filter(item => {
    const matchCat = filter === 'all' || item.category === filter;
    const matchSearch = !search || item.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Wardrobe</h2>
            <p>{items.length} items in your collection</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            + Add Item
          </button>
        </div>
      </div>

      <div className="wardrobe-controls">
        <input
          type="search" placeholder="Search items..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '220px', marginBottom: 0 }}
        />
        <div className="filter-chips">
          {categories.map(cat => (
            <button key={cat} className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              {cat !== 'all' && <span style={{ marginLeft: '4px', opacity: 0.7 }}>
                ({items.filter(i => i.category === cat).length})
              </span>}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👕</div>
          <h3>{items.length === 0 ? 'Your wardrobe is empty' : 'No items match'}</h3>
          <p>{items.length === 0
            ? 'Start adding your clothing items to build outfits and get recommendations.'
            : 'Try a different filter or search term.'}
          </p>
          {items.length === 0 && (
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add First Item</button>
          )}
        </div>
      ) : (
        <div className="clothing-grid">
          {filtered.map(item => (
            <div key={item.id} className="clothing-card">
              <div className="clothing-card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{getCategoryEmoji(item.category)}</span>
                )}
              </div>
              <div className="clothing-card-actions">
                <button className="card-action-btn" title="Delete" onClick={() => handleDelete(item)}>🗑</button>
              </div>
              <div className="clothing-card-info">
                <div className="clothing-card-name">{item.name}</div>
                <div className="clothing-card-meta">
                  <div className="color-dots">
                    {(item.colors || []).slice(0, 4).map(c => (
                      <div key={c} className="color-dot" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="tag" style={{ fontSize: '11px', padding: '2px 8px' }}>{item.season || 'all'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onSave={handleSave} />}
    </div>
  );
}
