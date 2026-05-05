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
  { id: 'muscular', label: 'Muscular', style: { transform: 'scaleX(1.15) scaleY(0.98)' } },
  { id: 'plus-size', label: 'Plus-Size', style: { transform: 'scaleX(1.3)' } }
];

export default function AvatarPreview({ selectedItems, avatarSettings, onSettingsChange }) {
  const { skinTone, bodyType } = avatarSettings;
  const currentBodyStyle = BODY_TYPES.find(b => b.id === bodyType)?.style || {};

  const renderClothingLayer = (item, clipId, x, y, width, height, fallbackColor) => {
    if (!item) return null;

    return (
      <g clipPath={`url(#${clipId})`} className="vto-svg-layer">
        {item.imageUrl ? (
          <image 
            href={item.imageUrl} 
            x={x} y={y} 
            width={width} height={height} 
            preserveAspectRatio="xMidYMid slice" 
          />
        ) : (
          <g>
            <rect x={x} y={y} width={width} height={height} fill={fallbackColor} />
            <text x={x + width/2} y={y + height/2 + 10} textAnchor="middle" fontSize="30" opacity="0.8">
              {getCategoryEmoji(item.category)}
            </text>
          </g>
        )}
        {/* Adds a slight shadow/texture overlay to the clothing to make it look 3D and not flat */}
        <rect x={x} y={y} width={width} height={height} fill="url(#clothing-shadow)" style={{ mixBlendMode: 'multiply' }} opacity="0.3" />
      </g>
    );
  };

  return (
    <div className="vto-preview-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="vto-avatar-stage" style={{ width: '250px', height: '550px' }}>
        
        <div className="vto-mannequin-wrapper" style={{ ...currentBodyStyle, width: '100%', height: '100%' }}>
          <svg className="vto-mannequin-svg" viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}>
            <defs>
              {/* Gradient for clothing depth */}
              <linearGradient id="clothing-shadow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
                <stop offset="20%" stopColor="#000" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#fff" stopOpacity="0.1" />
                <stop offset="80%" stopColor="#000" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
              </linearGradient>

              {/* TOP CLIPPING MASK (Torso + Arms) */}
              <clipPath id="clip-top">
                <path d="M60 90 Q 100 85 140 90 L 145 220 Q 100 230 55 220 Z" /> {/* Torso */}
                <path d="M55 95 Q 30 150 25 240 L 45 240 Q 50 160 65 105 Z" /> {/* L Arm */}
                <path d="M145 95 Q 170 150 175 240 L 155 240 Q 150 160 135 105 Z" /> {/* R Arm */}
              </clipPath>

              {/* BOTTOM CLIPPING MASK (Pelvis + Legs) */}
              <clipPath id="clip-bottom">
                <path d="M55 210 Q 100 230 145 210 L 140 450 L 110 450 L 105 250 L 95 250 L 90 450 L 60 450 Z" />
              </clipPath>

              {/* OUTERWEAR CLIPPING MASK (Slightly larger Top) */}
              <clipPath id="clip-outerwear">
                <g transform="scale(1.08) translate(-7.5, -5)">
                  <path d="M60 90 Q 100 80 140 90 L 145 250 Q 100 250 55 250 Z" />
                  <path d="M55 95 Q 30 150 20 250 L 45 250 Q 50 160 65 105 Z" />
                  <path d="M145 95 Q 170 150 180 250 L 155 250 Q 150 160 135 105 Z" />
                </g>
              </clipPath>

              {/* SHOES CLIPPING MASK (Feet) */}
              <clipPath id="clip-shoes">
                <ellipse cx="75" cy="460" rx="22" ry="14" />
                <ellipse cx="125" cy="460" rx="22" ry="14" />
              </clipPath>

              {/* Drop shadows for layers to give 3D overlap effect */}
              <filter id="shadow-bottom"><feDropShadow dx="0" dy="-2" stdDeviation="3" floodOpacity="0.3"/></filter>
              <filter id="shadow-top"><feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.4"/></filter>
              <filter id="shadow-outerwear"><feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.5"/></filter>
            </defs>

            {/* 1. BASE MANNEQUIN (SKIN) */}
            <g fill={skinTone}>
              <circle cx="100" cy="50" r="28" /> {/* Head */}
              <rect x="88" y="70" width="24" height="25" rx="5" /> {/* Neck */}
              {/* Torso */}
              <path d="M60 90 Q 100 85 140 90 L 145 220 Q 100 230 55 220 Z" />
              {/* L Arm */}
              <path d="M55 95 Q 30 150 25 240 L 45 240 Q 50 160 65 105 Z" />
              {/* R Arm */}
              <path d="M145 95 Q 170 150 175 240 L 155 240 Q 150 160 135 105 Z" />
              {/* Legs */}
              <path d="M55 210 Q 100 230 145 210 L 140 450 L 110 450 L 105 250 L 95 250 L 90 450 L 60 450 Z" />
              {/* Feet */}
              <ellipse cx="75" cy="460" rx="18" ry="12" />
              <ellipse cx="125" cy="460" rx="18" ry="12" />
            </g>

            {/* 2. CLOTHING LAYERS (Clipped to body parts) */}
            
            {/* Bottoms */}
            {selectedItems.bottom && (
              <g filter="url(#shadow-bottom)">
                {renderClothingLayer(selectedItems.bottom, 'clip-bottom', 40, 200, 120, 260, '#3b5998')}
              </g>
            )}

            {/* Tops */}
            {selectedItems.top && (
              <g filter="url(#shadow-top)">
                {renderClothingLayer(selectedItems.top, 'clip-top', 10, 80, 180, 170, '#d4774a')}
              </g>
            )}

            {/* Outerwear */}
            {selectedItems.outerwear && (
              <g filter="url(#shadow-outerwear)">
                {renderClothingLayer(selectedItems.outerwear, 'clip-outerwear', 0, 70, 200, 190, '#555555')}
              </g>
            )}

            {/* Shoes */}
            {selectedItems.shoes && (
              <g>
                {renderClothingLayer(selectedItems.shoes, 'clip-shoes', 40, 440, 120, 40, '#222222')}
              </g>
            )}

          </svg>
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
