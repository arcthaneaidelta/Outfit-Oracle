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

  const topJoints = autoFitStyles.top?.joints || autoFitStyles.outerwear?.joints;
  const bottomJoints = autoFitStyles.bottom?.joints;

  return (
    <div className="vto-preview-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="vto-avatar-stage" style={{ width: '200px', height: '500px', position: 'relative' }}>
        
        {/* THE MANNEQUIN (Dynamic Limbs) */}
        <div className="vto-mannequin-wrapper" style={{ ...currentBodyStyle, width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 1 }}>
          <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }}>
            <g fill={skinTone} stroke={skinTone} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="100" cy="45" r="28" strokeWidth="0" /> {/* Head */}
              <rect x="88" y="70" width="24" height="25" rx="5" strokeWidth="0" /> {/* Neck */}
              
              {/* Torso */}
              <path d="M 88 90 L 40 100 L 60 230 L 140 230 L 160 100 L 112 90 Z" strokeWidth="0" />
              
              {/* DYNAMIC ARMS */}
              {topJoints ? (
                <>
                  {/* Left Arm sprouting from detected sleeve hole */}
                  <line x1={topJoints.leftSleeve.x + 8} y1={topJoints.leftSleeve.y} x2={topJoints.leftSleeve.x - 5} y2={280} strokeWidth="18" />
                  <ellipse cx={topJoints.leftSleeve.x - 5} cy={290} rx="10" ry="15" strokeWidth="0" transform={`rotate(15 ${topJoints.leftSleeve.x - 5} 290)`} />

                  {/* Right Arm sprouting from detected sleeve hole */}
                  <line x1={topJoints.rightSleeve.x - 8} y1={topJoints.rightSleeve.y} x2={topJoints.rightSleeve.x + 5} y2={280} strokeWidth="18" />
                  <ellipse cx={topJoints.rightSleeve.x + 5} cy={290} rx="10" ry="15" strokeWidth="0" transform={`rotate(-15 ${topJoints.rightSleeve.x + 5} 290)`} />
                </>
              ) : (
                <>
                  {/* Default Static Arms */}
                  <path d="M 40 100 L 25 280 L 45 280 L 60 110 Z" strokeWidth="0" />
                  <path d="M 160 100 L 175 280 L 155 280 L 140 110 Z" strokeWidth="0" />
                  <ellipse cx="35" cy={290} rx="10" ry="15" strokeWidth="0" transform="rotate(15 35 290)" />
                  <ellipse cx="165" cy={290} rx="10" ry="15" strokeWidth="0" transform="rotate(-15 165 290)" />
                </>
              )}

              {/* DYNAMIC LEGS */}
              {bottomJoints ? (
                <>
                  {/* Left Shin sprouting from detected pant leg hole */}
                  <line x1={bottomJoints.leftLeg.x} y1={bottomJoints.leftLeg.y - 10} x2={bottomJoints.leftLeg.x} y2={450} strokeWidth="25" />
                  <ellipse cx={bottomJoints.leftLeg.x} cy={460} rx="15" ry="10" strokeWidth="0" />

                  {/* Right Shin sprouting from detected pant leg hole */}
                  <line x1={bottomJoints.rightLeg.x} y1={bottomJoints.rightLeg.y - 10} x2={bottomJoints.rightLeg.x} y2={450} strokeWidth="25" />
                  <ellipse cx={bottomJoints.rightLeg.x} cy={460} rx="15" ry="10" strokeWidth="0" />
                </>
              ) : (
                <>
                  {/* Default Static Legs */}
                  <path d="M 60 230 L 60 450 L 90 450 L 95 230 Z" strokeWidth="0" />
                  <path d="M 140 230 L 140 450 L 110 450 L 105 230 Z" strokeWidth="0" />
                  <ellipse cx="75" cy={460} rx="15" ry="10" strokeWidth="0" />
                  <ellipse cx="125" cy={460} rx="15" ry="10" strokeWidth="0" />
                </>
              )}

            </g>
          </svg>
        </div>

        {/* CLOTHING LAYERS */}
        
        {selectedItems.bottom && (
          <div className="vto-clothing-layer" style={{ zIndex: 2, ...currentBodyStyle, ...autoFitStyles.bottom }}>
            {processedImages.bottom ? (
              <img src={processedImages.bottom} alt="Bottom" />
            ) : (
              <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.bottom.category)}</div>
            )}
          </div>
        )}

        {selectedItems.top && (
          <div className="vto-clothing-layer" style={{ zIndex: 3, ...currentBodyStyle, ...autoFitStyles.top }}>
            {processedImages.top ? (
              <img src={processedImages.top} alt="Top" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.top.category)}</div>
            )}
          </div>
        )}

        {selectedItems.outerwear && (
          <div className="vto-clothing-layer" style={{ zIndex: 4, ...currentBodyStyle, ...autoFitStyles.outerwear }}>
            {processedImages.outerwear ? (
              <img src={processedImages.outerwear} alt="Outerwear" />
            ) : (
               <div className="vto-emoji-fallback">{getCategoryEmoji(selectedItems.outerwear.category)}</div>
            )}
          </div>
        )}

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
