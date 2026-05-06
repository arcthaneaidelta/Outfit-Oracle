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

export default function AvatarPreview({ selectedItems, processedImages, autoFitStyles, avatarSettings, onSettingsChange }) {
  const { skinTone, bodyType } = avatarSettings;
  const currentBodyStyle = BODY_TYPES.find(b => b.id === bodyType)?.style || {};

  return (
    <div className="vto-preview-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="vto-avatar-stage" style={{ width: '250px', height: '550px', position: 'relative' }}>
        
        {/* THE MANNEQUIN (Always Visible Background) */}
        {/* We meticulously designed these SVG paths so the torso and hips perfectly fit INSIDE the Auto-Fit clothing bounds, while the arms and lower legs stick out. */}
        <div className="vto-mannequin-wrapper" style={{ ...currentBodyStyle, width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}>
          <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}>
            <g fill={skinTone}>
              <circle cx="100" cy="45" r="28" /> {/* Head */}
              <rect x="88" y="70" width="24" height="25" rx="5" /> {/* Neck */}
              
              {/* Torso (Shoulders width 120, Waist width 80) */}
              <path d="M 88 90 L 40 100 L 60 230 L 140 230 L 160 100 L 112 90 Z" />
              
              {/* Arms (Angled slightly outwards so they emerge from sleeves) */}
              <path d="M 40 100 L 25 280 L 45 280 L 60 110 Z" />
              <path d="M 160 100 L 175 280 L 155 280 L 140 110 Z" />

              {/* Hands */}
              <ellipse cx="35" cy="290" rx="10" ry="15" transform="rotate(15 35 290)" />
              <ellipse cx="165" cy="290" rx="10" ry="15" transform="rotate(-15 165 290)" />

              {/* Legs (Hips width 80, going straight down) */}
              <path d="M 60 230 L 60 450 L 90 450 L 95 230 Z" />
              <path d="M 140 230 L 140 450 L 110 450 L 105 230 Z" />
              
              {/* Feet */}
              <ellipse cx="75" cy="460" rx="15" ry="10" />
              <ellipse cx="125" cy="460" rx="15" ry="10" />
            </g>
          </svg>
        </div>

        {/* CLOTHING LAYERS (Transparent PNGs positioned by Auto-Fit AI) */}
        
        {/* Layer 1: Bottoms */}
        {selectedItems.bottom && (
          <div className="vto-clothing-layer" style={{ zIndex: 2, ...currentBodyStyle, ...autoFitStyles.bottom }}>
            {processedImages.bottom ? (
              <img src={processedImages.bottom} alt="Bottom" />
            ) : (
              <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.bottom.category)}</div>
            )}
          </div>
        )}

        {/* Layer 2: Tops */}
        {selectedItems.top && (
          <div className="vto-clothing-layer" style={{ zIndex: 3, ...currentBodyStyle, ...autoFitStyles.top }}>
            {processedImages.top ? (
              <img src={processedImages.top} alt="Top" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.top.category)}</div>
            )}
          </div>
        )}

        {/* Layer 3: Outerwear */}
        {selectedItems.outerwear && (
          <div className="vto-clothing-layer" style={{ zIndex: 4, ...currentBodyStyle, ...autoFitStyles.outerwear }}>
            {processedImages.outerwear ? (
              <img src={processedImages.outerwear} alt="Outerwear" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.outerwear.category)}</div>
            )}
          </div>
        )}

        {/* Layer 4: Shoes */}
        {selectedItems.shoes && (
          <div className="vto-clothing-layer" style={{ zIndex: 5, ...currentBodyStyle, ...autoFitStyles.shoes }}>
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
