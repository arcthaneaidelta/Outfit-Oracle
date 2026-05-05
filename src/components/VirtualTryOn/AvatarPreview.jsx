import { getCategoryEmoji } from '../../utils/recommendations';

const SKIN_TONES = [
  { id: '#fcdfb6', label: 'Light' },
  { id: '#e3c2a4', label: 'Medium' },
  { id: '#8d5524', label: 'Dark' },
  { id: '#3c2218', label: 'Deep' }
];

const BODY_TYPES = [
  { id: 'slim', label: 'Slim', style: { transform: 'scaleX(0.9)' } },
  { id: 'average', label: 'Average', style: { transform: 'scaleX(1)' } },
  { id: 'muscular', label: 'Muscular', style: { transform: 'scaleX(1.12) scaleY(0.98)' } },
  { id: 'plus-size', label: 'Plus-Size', style: { transform: 'scaleX(1.25)' } }
];

export default function AvatarPreview({ selectedItems, avatarSettings, onSettingsChange }) {
  const { skinTone, bodyType } = avatarSettings;
  const currentBodyStyle = BODY_TYPES.find(b => b.id === bodyType)?.style || {};

  const renderItemLayer = (item, layerClass) => {
    if (!item) return null;

    return (
      <div className={`vto-layer ${layerClass}`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="vto-item-img" />
        ) : (
          <div className="vto-item-emoji-wrapper">
             {getCategoryEmoji(item.category)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="vto-preview-container">
      <div className="vto-avatar-stage">
        {/* The Mannequin */}
        <div className="vto-mannequin-wrapper" style={{ ...currentBodyStyle }}>
          <svg className="vto-mannequin-svg" viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill={skinTone}>
              {/* Head */}
              <circle cx="100" cy="50" r="30" />
              {/* Neck */}
              <rect x="85" y="70" width="30" height="25" rx="5" />
              {/* Torso */}
              <path d="M60 90 Q 100 85 140 90 L 145 220 Q 100 230 55 220 Z" />
              {/* Arms */}
              <path d="M55 95 Q 30 150 25 240 L 45 240 Q 50 160 65 105 Z" />
              <path d="M145 95 Q 170 150 175 240 L 155 240 Q 150 160 135 105 Z" />
              {/* Legs */}
              <path d="M65 210 L 60 450 L 90 450 L 95 230 Z" />
              <path d="M135 210 L 140 450 L 110 450 L 105 230 Z" />
              {/* Feet */}
              <ellipse cx="75" cy="455" rx="18" ry="10" />
              <ellipse cx="125" cy="455" rx="18" ry="10" />
            </g>
          </svg>
        </div>

        {/* Clothing Layers */}
        {/* Z-index matters here: Bottom -> Top -> Outerwear -> Shoes (or shoes on bottom) */}
        
        {/* Bottoms */}
        <div className="vto-layer-container" style={{ zIndex: 10, ...currentBodyStyle }}>
          {renderItemLayer(selectedItems.bottom, 'vto-layer-bottom')}
        </div>
        
        {/* Tops */}
        <div className="vto-layer-container" style={{ zIndex: 20, ...currentBodyStyle }}>
           {renderItemLayer(selectedItems.top, 'vto-layer-top')}
        </div>

        {/* Outerwear */}
        <div className="vto-layer-container" style={{ zIndex: 30, ...currentBodyStyle }}>
           {renderItemLayer(selectedItems.outerwear, 'vto-layer-outerwear')}
        </div>

        {/* Shoes */}
        <div className="vto-layer-container" style={{ zIndex: 40, ...currentBodyStyle }}>
           {renderItemLayer(selectedItems.shoes, 'vto-layer-shoes')}
        </div>
      </div>

      {/* Customization Controls */}
      <div className="vto-customization">
        <div className="vto-setting-group">
          <label>Skin Tone</label>
          <div className="vto-options-row">
            {SKIN_TONES.map(tone => (
              <button
                key={tone.id}
                className={`vto-color-swatch ${skinTone === tone.id ? 'active' : ''}`}
                style={{ backgroundColor: tone.id }}
                title={tone.label}
                onClick={() => onSettingsChange({ skinTone: tone.id })}
              />
            ))}
          </div>
        </div>

        <div className="vto-setting-group">
          <label>Body Type</label>
          <div className="vto-options-row">
            {BODY_TYPES.map(bt => (
              <button
                key={bt.id}
                className={`vto-pill-btn ${bodyType === bt.id ? 'active' : ''}`}
                onClick={() => onSettingsChange({ bodyType: bt.id })}
              >
                {bt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
