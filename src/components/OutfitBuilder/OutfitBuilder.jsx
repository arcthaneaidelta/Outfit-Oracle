import { useState } from 'react';
import { getCategoryEmoji, OCCASIONS, SEASONS } from '../../utils/recommendations';
import { useToast } from '../shared/ToastContext';

const SLOT_CONFIG = [
  { key: 'top', label: 'Top', categories: ['top', 'dress'], required: true },
  { key: 'bottom', label: 'Bottom', categories: ['bottom', 'dress'], required: true },
  { key: 'shoes', label: 'Shoes', categories: ['shoes'], required: true },
  { key: 'outerwear', label: 'Outerwear', categories: ['outerwear'], required: false },
  { key: 'accessory', label: 'Accessory', categories: ['accessory', 'bag'], required: false },
  { key: 'bag', label: 'Bag', categories: ['bag'], required: false },
];

export default function OutfitBuilder({ wardrobe, saveOutfit, outfits }) {
  const { addToast } = useToast();
  const [slots, setSlots] = useState({ top: null, bottom: null, shoes: null, outerwear: null, accessory: null, bag: null });
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [season, setSeason] = useState('all');
  const [activeSlot, setActiveSlot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingOutfitId, setEditingOutfitId] = useState(null);
  const [showExisting, setShowExisting] = useState(false);

  const canSave = slots.top && slots.bottom && slots.shoes && name.trim();

  const handleSlotClick = (slotKey) => {
    setActiveSlot(slotKey === activeSlot ? null : slotKey);
  };

  const handlePickItem = (item) => {
    if (!activeSlot) return;
    setSlots(prev => ({ ...prev, [activeSlot]: item.id }));
    setActiveSlot(null);
  };

  const handleRemoveSlot = (slotKey, e) => {
    e.stopPropagation();
    setSlots(prev => ({ ...prev, [slotKey]: null }));
  };

  const getSlotItem = (key) => wardrobe.find(i => i.id === slots[key]);

  const getFilteredItems = () => {
    if (!activeSlot) return [];
    const config = SLOT_CONFIG.find(s => s.key === activeSlot);
    return wardrobe.filter(i => config?.categories.includes(i.category));
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await saveOutfit({ name, occasion, season, ...slots });
      addToast(`Outfit "${name}" saved!`, 'success');
      setSlots({ top: null, bottom: null, shoes: null, outerwear: null, accessory: null, bag: null });
      setName('');
    } catch (e) {
      addToast('Failed to save outfit', 'error');
    } finally {
      setSaving(false);
    }
  };

  const loadOutfit = (outfit) => {
    setSlots({
      top: outfit.top || null, bottom: outfit.bottom || null, shoes: outfit.shoes || null,
      outerwear: outfit.outerwear || null, accessory: outfit.accessory || null, bag: outfit.bag || null,
    });
    setName(outfit.name + ' (copy)');
    setOccasion(outfit.occasion || 'Casual');
    setSeason(outfit.season || 'all');
    setEditingOutfitId(outfit.id);
    setShowExisting(false);
  };

  const pickerItems = getFilteredItems();

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Outfit Builder</h2>
            <p>Combine items to create and save complete outfits</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowExisting(!showExisting)}>
            {showExisting ? 'Hide' : 'Load Existing'} Outfit
          </button>
        </div>
      </div>

      {/* Load existing outfits */}
      {showExisting && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Your Outfits</h3>
          {outfits.length === 0 ? (
            <p style={{ color: 'var(--charcoal-muted)', fontSize: '14px' }}>No outfits yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
              {outfits.map(o => (
                <button key={o.id} className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}
                  onClick={() => loadOutfit(o)}>
                  <span style={{ fontSize: '20px' }}>
                    {[o.top, o.bottom, o.shoes].filter(Boolean).map(id => {
                      const item = wardrobe.find(i => i.id === id);
                      return item ? getCategoryEmoji(item.category) : '';
                    }).join('')}
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
                    {o.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="outfit-builder-layout">
        {/* Slots Grid */}
        <div>
          <div className="outfit-slots">
            {SLOT_CONFIG.map(config => {
              const item = getSlotItem(config.key);
              const isActive = activeSlot === config.key;
              return (
                <div key={config.key}
                  className={`outfit-slot ${item ? 'filled' : ''}`}
                  style={{ borderColor: isActive ? 'var(--terracotta)' : undefined, background: isActive ? 'var(--terracotta-pale)' : undefined }}
                  onClick={() => handleSlotClick(config.key)}>
                  {item ? (
                    <>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="outfit-slot-image" />
                      ) : (
                        <span className="outfit-slot-icon">{getCategoryEmoji(item.category)}</span>
                      )}
                      <div className="outfit-slot-overlay">
                        <span style={{ color: 'white', fontSize: '13px' }}>Change</span>
                      </div>
                      <button className="outfit-slot-remove" onClick={e => handleRemoveSlot(config.key, e)}>×</button>
                    </>
                  ) : (
                    <>
                      <span className="outfit-slot-icon" style={{ fontSize: '32px', opacity: isActive ? 1 : 0.4 }}>
                        {getCategoryEmoji(config.key)}
                      </span>
                    </>
                  )}
                  <span className="outfit-slot-label" style={{ position: 'absolute', bottom: '10px' }}>
                    {config.label}{config.required ? ' *' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Validation */}
          {!canSave && (slots.top || slots.bottom || slots.shoes) && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--cream)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--charcoal-muted)' }}>
              {!slots.top && <div>⚠️ Add a top</div>}
              {!slots.bottom && <div>⚠️ Add a bottom</div>}
              {!slots.shoes && <div>⚠️ Add shoes</div>}
              {!name.trim() && <div>⚠️ Enter an outfit name</div>}
            </div>
          )}
        </div>

        {/* Sidebar: Metadata + Picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Outfit Details */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Outfit Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Outfit Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunday Brunch Look" />
              </div>
              <div className="form-group">
                <label>Occasion</label>
                <select value={occasion} onChange={e => setOccasion(e.target.value)}>
                  {OCCASIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Season</label>
                <select value={season} onChange={e => setSeason(e.target.value)}>
                  {SEASONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                disabled={!canSave || saving} onClick={handleSave}>
                {saving ? 'Saving...' : '💾 Save Outfit'}
              </button>
            </div>
          </div>

          {/* Item Picker */}
          {activeSlot && (
            <div className="item-picker">
              <div className="item-picker-header">
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  Select {SLOT_CONFIG.find(s => s.key === activeSlot)?.label}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--charcoal-muted)', marginTop: '4px' }}>
                  {pickerItems.length} available
                </div>
              </div>
              {pickerItems.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--charcoal-muted)', fontSize: '13px' }}>
                  No {activeSlot} items in your wardrobe yet.
                </div>
              ) : (
                <div className="item-picker-grid">
                  {pickerItems.map(item => (
                    <div key={item.id}
                      className={`item-picker-card ${slots[activeSlot] === item.id ? 'selected' : ''}`}
                      onClick={() => handlePickItem(item)}>
                      <div style={{
                        aspectRatio: '3/4', background: 'var(--cream-dark)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
                        overflow: 'hidden',
                      }}>
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : getCategoryEmoji(item.category)}
                      </div>
                      <div style={{ padding: '8px', fontSize: '11px', fontWeight: 500, color: 'var(--charcoal-light)' }}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!activeSlot && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--charcoal-muted)', fontSize: '13px', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--cream-darker)' }}>
              👆 Click a slot above to pick an item
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
