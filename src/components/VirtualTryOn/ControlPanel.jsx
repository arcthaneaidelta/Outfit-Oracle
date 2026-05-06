import React from 'react';

const SKIN_TONES = [
  { id: 'light', value: '#fcdfb6', label: 'Light' },
  { id: 'medium', value: '#e2b98f', label: 'Medium' },
  { id: 'dark', value: '#8d5524', label: 'Dark' },
];

const BODY_TYPES = [
  { id: 'slim', label: 'Slim', scale: 0.9 },
  { id: 'regular', label: 'Regular', scale: 1.0 },
  { id: 'bulky', label: 'Bulky', scale: 1.1 },
];

export default function ControlPanel({ settings, onChange, onReset }) {
  return (
    <div className="vto-controls">
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

      <div className="control-group" style={{ marginTop: 'auto', paddingTop: '20px' }}>
        <button className="vto-btn-outline" onClick={onReset}>
           <i className="fas fa-undo"></i> Reset Outfit
        </button>
      </div>
    </div>
  );
}
