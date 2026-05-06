import React from 'react';

export default function AvatarPreview({ selectedItems, processedImages, autoFitStyles, avatarSettings }) {
  const { skinTone, bodyType } = avatarSettings;

  // Body scale mapping
  const bodyScales = {
    slim: 0.9,
    regular: 1.0,
    bulky: 1.15,
  };

  const scale = bodyScales[bodyType] || 1.0;

  return (
    <div className="vto-avatar-stage" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="vto-layers-container" style={{ position: 'relative', width: '300px', height: '600px', transform: `scale(${scale})`, transition: 'transform 0.4s ease' }}>
        
        {/* 1. TORSO BASE (Lowest) */}
        <div className="vto-body-part" style={{ zIndex: 0 }}>
          <svg viewBox="0 0 200 500" width="100%" height="100%">
             <path d="M60 100 Q 100 90, 140 100 L 130 300 L 70 300 Z" fill={skinTone} />
          </svg>
        </div>

        {/* 2. PANTS (Behind feet/arms) */}
        {processedImages.bottom && (
          <div className="vto-layer" style={{ zIndex: 1, ...autoFitStyles.bottom }}>
            <img src={processedImages.bottom} alt="Pants" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}

        {/* 3. SHIRT (Behind neck/arms) */}
        {processedImages.top && (
          <div className="vto-layer" style={{ zIndex: 2, ...autoFitStyles.top }}>
            <img src={processedImages.top} alt="Shirt" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}

        {/* 4. FEET & LEGS FRONT */}
        <div className="vto-body-part" style={{ zIndex: 3 }}>
          <svg viewBox="0 0 200 500" width="100%" height="100%">
            {/* Legs */}
            <rect x="70" y="300" width="25" height="180" rx="12" fill={skinTone} />
            <rect x="105" y="300" width="25" height="180" rx="12" fill={skinTone} />
            {/* Feet */}
            <rect x="65" y="470" width="35" height="15" rx="5" fill={skinTone} />
            <rect x="100" y="470" width="35" height="15" rx="5" fill={skinTone} />
          </svg>
        </div>

        {/* 5. ARMS FRONT */}
        <div className="vto-body-part" style={{ zIndex: 4 }}>
          <svg viewBox="0 0 200 500" width="100%" height="100%">
            {/* Upper Arms */}
            <rect x="35" y="100" width="25" height="120" rx="12" fill={skinTone} />
            <rect x="140" y="100" width="25" height="120" rx="12" fill={skinTone} />
            {/* Lower Arms & Hands */}
            <rect x="35" y="210" width="25" height="100" rx="12" fill={skinTone} />
            <rect x="140" y="210" width="25" height="100" rx="12" fill={skinTone} />
          </svg>
        </div>

        {/* 6. NECK & HEAD FRONT (Topmost body parts) */}
        <div className="vto-body-part" style={{ zIndex: 5 }}>
          <svg viewBox="0 0 200 500" width="100%" height="100%">
            <rect x="90" y="80" width="20" height="30" fill={skinTone} />
            <circle cx="100" cy="60" r="30" fill={skinTone} />
            <circle cx="100" cy="58" r="32" fill="rgba(0,0,0,0.05)" />
          </svg>
        </div>

        {/* 7. SHOES (Optional extra layer) */}
        {processedImages.shoes && (
          <div className="vto-layer" style={{ zIndex: 6, ...autoFitStyles.shoes }}>
            <img src={processedImages.shoes} alt="Shoes" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}

      </div>
    </div>
  );
}
