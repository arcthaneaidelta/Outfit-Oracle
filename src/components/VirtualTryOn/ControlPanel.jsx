import React from 'react';

const SKIN_TONES = [
  { id: 'light', value: '#fcdfb6', label: 'Light' },
  { id: 'medium', value: '#e2b98f', label: 'Medium' },
  { id: 'dark', value: '#8d5524', label: 'Dark' },
];

const BODY_TYPES = [
  { id: 'slim', label: 'Slim' },
  { id: 'regular', label: 'Regular' },
  { id: 'bulky', label: 'Bulky' },
];

export default function ControlPanel({ settings, tuning, activeCategory, onChange, onTune, onReset }) {
  return (
    <div className="vto-controls">
      {/* 1. SKIN TONE */}
      <div className="control-group">
        <label>Skin Tone</label>
        <div className="tone-grid">
          {SKIN_TONES.map(tone => (
            <button 
              key={tone.id}
              className={`tone-btn ${settings.skinTone === tone.value ? 'active' : ''}`}
              style={{ background: tone.value }}
              onClick={() => onChange({ skinTone: tone.value })}
              title={tone.label}
            />
          ))}
        </div>
      </div>

      {/* 2. BODY TYPE */}
      <div className="control-group">
        <label>Body Type</label>
        <div className="type-list">
          {BODY_TYPES.map(type => (
            <button 
              key={type.id}
              className={`type-btn ${settings.bodyType === type.id ? 'active' : ''}`}
              onClick={() => onChange({ bodyType: type.id })}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MANUAL NUDGE (Only shows if an item is selected) */}
      {activeCategory && tuning[activeCategory] && (
        <div className="control-group tuning-panel glass-panel">
          <label>Nudge active item: {activeCategory}</label>
          <div className="tuning-controls">
             <div className="tuning-row">
               <span>Top</span>
               <input 
                 type="range" min="-100" max="500" value={parseInt(tuning[activeCategory].top) || 0} 
                 onChange={(e) => onTune(activeCategory, 'top', e.target.value + 'px')}
               />
             </div>
             <div className="tuning-row">
               <span>Width</span>
               <input 
                 type="range" min="10" max="150" value={parseInt(tuning[activeCategory].width) || 100} 
                 onChange={(e) => onTune(activeCategory, 'width', e.target.value + '%')}
               />
             </div>
          </div>
          <p className="tuning-hint">Adjust for pixel-perfect fit</p>
        </div>
      )}

      <div className="control-group" style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button className="vto-btn-outline" onClick={onReset}>
           <i className="fas fa-undo"></i> Reset Outfit
        </button>
      </div>
    </div>
  );
}
