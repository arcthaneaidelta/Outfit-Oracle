import { getCategoryEmoji } from '../../utils/recommendations';

const SKIN_TONES = [
  { id: '#fcdfb6', label: 'Light' },
  { id: '#e3c2a4', label: 'Medium' },
  { id: '#8d5524', label: 'Dark' },
  { id: '#3c2218', label: 'Deep' }
];

const BODY_TYPES = [
  { id: 'slim', label: 'Slim', style: { transform: 'scaleX(0.85)' } },
  { id: 'average', label: 'Average', style: { transform: 'scaleX(1)' } },
  { id: 'muscular', label: 'Muscular', style: { transform: 'scaleX(1.15) scaleY(0.98)' } },
  { id: 'plus-size', label: 'Plus-Size', style: { transform: 'scaleX(1.3)' } }
];

export default function AvatarPreview({ selectedItems, processedImages, avatarSettings, onSettingsChange }) {
  const { skinTone, bodyType } = avatarSettings;
  const currentBodyStyle = BODY_TYPES.find(b => b.id === bodyType)?.style || {};

  return (
    <div className="vto-preview-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="vto-avatar-stage" style={{ width: '250px', height: '550px', position: 'relative' }}>
        
        {/* THE MANNEQUIN (Background) */}
        <div className="vto-mannequin-wrapper" style={{ ...currentBodyStyle, width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}>
          <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}>
            <g fill={skinTone}>
              <circle cx="100" cy="50" r="28" /> {/* Head */}
              <rect x="88" y="70" width="24" height="25" rx="5" /> {/* Neck */}
              
              {/* Torso */}
              <path d="M65 90 Q 100 85 135 90 L 135 230 Q 100 240 65 230 Z" />
              
              {/* L Arm (Hanging down) */}
              <path d="M65 90 Q 40 100 45 150 L 50 260 Q 60 260 65 150 Z" />
              
              {/* R Arm (Hanging down) */}
              <path d="M135 90 Q 160 100 155 150 L 150 260 Q 140 260 135 150 Z" />

              {/* Legs */}
              <path d="M65 230 L 60 450 L 90 450 L 95 240 Z" />
              <path d="M135 230 L 140 450 L 110 450 L 105 240 Z" />
              
              {/* Feet */}
              <ellipse cx="75" cy="455" rx="18" ry="12" />
              <ellipse cx="125" cy="455" rx="18" ry="12" />
            </g>
          </svg>
        </div>

        {/* CLOTHING LAYERS (Transparent PNGs from AI) */}
        
        {/* Layer 1: Bottoms */}
        {selectedItems.bottom && (
          <div className="vto-clothing-layer" style={{ zIndex: 2, top: '40%', height: '55%', width: '120%', left: '-10%', ...currentBodyStyle }}>
            {processedImages.bottom ? (
              <img src={processedImages.bottom} alt="Bottom" />
            ) : (
              <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.bottom.category)}</div>
            )}
          </div>
        )}

        {/* Layer 2: Tops */}
        {selectedItems.top && (
          <div className="vto-clothing-layer" style={{ zIndex: 3, top: '15%', height: '40%', width: '130%', left: '-15%', ...currentBodyStyle }}>
            {processedImages.top ? (
              <img src={processedImages.top} alt="Top" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.top.category)}</div>
            )}
          </div>
        )}

        {/* Layer 3: Outerwear */}
        {selectedItems.outerwear && (
          <div className="vto-clothing-layer" style={{ zIndex: 4, top: '13%', height: '45%', width: '140%', left: '-20%', ...currentBodyStyle }}>
            {processedImages.outerwear ? (
              <img src={processedImages.outerwear} alt="Outerwear" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.outerwear.category)}</div>
            )}
          </div>
        )}

        {/* Layer 4: Shoes */}
        {selectedItems.shoes && (
          <div className="vto-clothing-layer" style={{ zIndex: 5, top: '88%', height: '12%', width: '100%', left: '0', ...currentBodyStyle }}>
            {processedImages.shoes ? (
              <img src={processedImages.shoes} alt="Shoes" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.shoes.category)}</div>
            )}
          </div>
        )}

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
