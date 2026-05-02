import { useState } from 'react';
import { useToast } from '../shared/ToastContext';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Planner({ entries, planOutfit, removePlan, outfits, logWear }) {
  const { addToast } = useToast();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);

  const today = now.toISOString().split('T')[0];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const toDateStr = (day) => {
    const m = String(viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewYear}-${m}-${d}`;
  };

  const getEntryForDate = (dateStr) => entries.find(e => e.date === dateStr);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (day) => {
    const dateStr = toDateStr(day);
    setSelectedDate(dateStr);
    setShowOutfitPicker(true);
  };

  const handlePickOutfit = async (outfit) => {
    try {
      await planOutfit(selectedDate, outfit.id, outfit.name);
      addToast(`"${outfit.name}" planned for ${selectedDate}`, 'success');
      setShowOutfitPicker(false);
    } catch (e) {
      addToast('Failed to plan outfit', 'error');
    }
  };

  const handleRemovePlan = async (entry) => {
    if (!confirm('Remove this planned outfit?')) return;
    try {
      await removePlan(entry.id);
      addToast('Plan removed', 'info');
    } catch (e) {
      addToast('Failed to remove', 'error');
    }
  };

  const handleLogWear = async (entry) => {
    try {
      const outfit = outfits.find(o => o.id === entry.outfitId);
      const itemIds = [outfit?.top, outfit?.bottom, outfit?.shoes, outfit?.outerwear, outfit?.accessory].filter(Boolean);
      await logWear(entry.outfitId, entry.outfitName, itemIds);
      addToast(`"${entry.outfitName}" logged as worn!`, 'success');
    } catch (e) {
      addToast('Failed to log wear', 'error');
    }
  };

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const upcomingEntries = entries
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 7);

  return (
    <div>
      <div className="page-header">
        <h2>Planner</h2>
        <p>Schedule outfits for upcoming days</p>
      </div>

      <div className="planner-layout">
        {/* Calendar */}
        <div>
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button className="btn btn-ghost btn-sm" onClick={prevMonth}>← Prev</button>
            <h3 style={{ fontSize: '20px' }}>{MONTHS[viewMonth]} {viewYear}</h3>
            <button className="btn btn-ghost btn-sm" onClick={nextMonth}>Next →</button>
          </div>

          {/* Day headers */}
          <div className="calendar-grid" style={{ marginBottom: '8px' }}>
            {DAYS.map(d => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="calendar-grid">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const dateStr = toDateStr(day);
              const entry = getEntryForDate(dateStr);
              const isToday = dateStr === today;
              return (
                <div
                  key={day}
                  className={`calendar-day ${isToday ? 'today' : ''} ${entry ? 'has-outfit' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="calendar-day-number">{day}</div>
                  {entry && (
                    <div className="calendar-day-outfit">{entry.outfitName}</div>
                  )}
                  {entry && <div className="calendar-outfit-dot" />}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--charcoal-muted)', display: 'flex', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--sage)', display: 'inline-block' }} />
              Outfit planned
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--terracotta)', display: 'inline-block' }} />
              Today
            </span>
          </div>
        </div>

        {/* Upcoming sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Upcoming Plans</h3>
          {upcomingEntries.length === 0 ? (
            <div className="card">
              <div className="empty-state" style={{ padding: '24px', minHeight: 'auto' }}>
                <div className="empty-state-icon">📅</div>
                <p style={{ margin: 0 }}>No upcoming plans. Click a day to plan.</p>
              </div>
            </div>
          ) : (
            upcomingEntries.map(entry => {
              const [y, m, d] = entry.date.split('-');
              const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
              const isToday = entry.date === today;
              return (
                <div key={entry.id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ textAlign: 'center', minWidth: '44px' }}>
                      <div style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1 }}>
                        {d}
                      </div>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--charcoal-muted)' }}>
                        {dateObj.toLocaleString('en', { month: 'short' })}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                        {entry.outfitName}
                        {isToday && <span className="tag tag-terracotta" style={{ marginLeft: '8px', fontSize: '10px' }}>Today</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {isToday && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleLogWear(entry)}>
                            ✓ Worn
                          </button>
                        )}
                        <button className="btn btn-sm btn-ghost" onClick={() => handleRemovePlan(entry)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Outfit Picker Modal */}
      {showOutfitPicker && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowOutfitPicker(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Choose Outfit for {selectedDate}</h3>
              <button className="modal-close" onClick={() => setShowOutfitPicker(false)}>×</button>
            </div>

            {/* Show existing plan */}
            {getEntryForDate(selectedDate) && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--terracotta-pale)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                Currently: <strong>{getEntryForDate(selectedDate).outfitName}</strong>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: '12px' }}
                  onClick={() => handleRemovePlan(getEntryForDate(selectedDate))}>
                  Remove
                </button>
              </div>
            )}

            {outfits.length === 0 ? (
              <p style={{ color: 'var(--charcoal-muted)', fontSize: '14px' }}>No outfits available. Create some first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                {outfits.map(o => (
                  <button key={o.id} className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '12px' }}
                    onClick={() => handlePickOutfit(o)}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{o.name}</span>
                      {o.occasion && <span style={{ fontSize: '11px', color: 'var(--charcoal-muted)' }}>{o.occasion} · {o.season}</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
