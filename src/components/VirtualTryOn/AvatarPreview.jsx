import React from 'react';

export default function AvatarPreview({ selectedItems, processedImages, autoFitStyles, avatarSettings }) {
  const { skinTone, bodyType } = avatarSettings;

  // Body scale mapping
  const bodyScales = {
    slim: 'scale(0.9, 1.0)',
    regular: 'scale(1.0, 1.0)',
    bulky: 'scale(1.15, 1.0)',
  };

  return (
    <div className="vto-avatar-stage">
      <div className="vto-layers-container" style={{ transform: bodyScales[bodyType], transition: 'transform 0.4s ease' }}>
        
        {/* LAYER 1: BASE TORSO (Behind everything) */}
        <div className="vto-body-part torso-base" style={{ zIndex: 0 }}>
          <svg viewBox="0 0 400 800">
             <path d="M120 130 C 140 130, 260 130, 280 130 L 260 400 L 140 400 Z" fill={skinTone} />
          </svg>
        </div>

        {/* LAYER 2: PANTS (Above torso) */}
        {processedImages.bottom && (
          <div className="vto-layer bottom-layer" style={{ zIndex: 1, ...autoFitStyles.bottom }}>
            <img src={processedImages.bottom} alt="Pants" />
          </div>
        )}

        {/* LAYER 3: SHIRT (Above pants/torso) */}
        {processedImages.top && (
          <div className="vto-layer top-layer" style={{ zIndex: 2, ...autoFitStyles.top }}>
            <img src={processedImages.top} alt="Shirt" />
          </div>
        )}

        {/* LAYER 4: FEET (Above pants to create "worn" look) */}
        <div className="vto-body-part feet-front" style={{ zIndex: 3 }}>
          <svg viewBox="0 0 400 800">
            <rect x="140" y="720" width="55" height="30" rx="10" fill={skinTone} />
            <rect x="205" y="720" width="55" height="30" rx="10" fill={skinTone} />
          </svg>
        </div>

        {/* LAYER 5: ARMS (Above shirt sleeves) */}
        <div className="vto-body-part arms-front" style={{ zIndex: 4 }}>
          <svg viewBox="0 0 400 800">
            {/* Upper arms (partially covered) */}
            <rect x="70" y="130" width="40" height="150" rx="20" fill={skinTone} opacity="0.3" />
            <rect x="290" y="130" width="40" height="150" rx="20" fill={skinTone} opacity="0.3" />
            {/* Lower arms and hands (fully visible) */}
            <rect x="70" y="280" width="40" height="120" rx="20" fill={skinTone} />
            <rect x="290" y="280" width="40" height="120" rx="20" fill={skinTone} />
          </svg>
        </div>

        {/* LAYER 6: NECK & HEAD (Above shirt collar) */}
        <div className="vto-body-part neck-head-front" style={{ zIndex: 5 }}>
          <svg viewBox="0 0 400 800">
            {/* Neck */}
            <rect x="185" y="100" width="30" height="40" fill={skinTone} />
            {/* Head */}
            <circle cx="200" cy="70" r="40" fill={skinTone} />
            {/* Hair/Features placeholder */}
            <circle cx="200" cy="65" r="42" fill="rgba(0,0,0,0.1)" stroke="rgba(255,255,255,0.1)" />
          </svg>
        </div>

        {/* SHOES (Actually we put them below feet layer if they are being "worn") */}
        {processedImages.shoes && (
          <div className="vto-layer shoes-layer" style={{ zIndex: 6, ...autoFitStyles.shoes }}>
            <img src={processedImages.shoes} alt="Shoes" />
          </div>
        )}

      </div>
    </div>
  );
}
