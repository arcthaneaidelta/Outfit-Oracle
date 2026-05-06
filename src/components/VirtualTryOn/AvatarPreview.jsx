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
        
        {/* 1. THE BASE HUMAN AVATAR (SVG) */}
        <div className="vto-base-avatar">
          <svg viewBox="0 0 400 800" width="100%" height="100%">
            {/* Simple Stylized Human Body */}
            {/* Head */}
            <circle cx="200" cy="80" r="35" fill={skinTone} />
            {/* Neck */}
            <rect x="185" y="110" width="30" height="20" fill={skinTone} />
            {/* Torso */}
            <path d="M120 130 C 140 130, 260 130, 280 130 L 260 400 L 140 400 Z" fill={skinTone} />
            {/* Arms */}
            <rect x="70" y="130" width="50" height="200" rx="25" fill={skinTone} />
            <rect x="280" y="130" width="50" height="200" rx="25" fill={skinTone} />
            {/* Legs */}
            <rect x="140" y="400" width="55" height="350" rx="25" fill={skinTone} />
            <rect x="205" y="400" width="55" height="350" rx="25" fill={skinTone} />
          </svg>
        </div>

        {/* 2. SHOES LAYER (Bottom) */}
        {processedImages.shoes && (
          <div className="vto-layer shoes-layer" style={{ zIndex: 1, ...autoFitStyles.shoes }}>
            <img src={processedImages.shoes} alt="Shoes" />
          </div>
        )}

        {/* 3. PANTS/BOTTOMS LAYER (Middle) */}
        {processedImages.bottom && (
          <div className="vto-layer bottom-layer" style={{ zIndex: 2, ...autoFitStyles.bottom }}>
            <img src={processedImages.bottom} alt="Bottom" />
          </div>
        )}

        {/* 4. SHIRTS/TOPS LAYER (Top) */}
        {processedImages.top && (
          <div className="vto-layer top-layer" style={{ zIndex: 3, ...autoFitStyles.top }}>
            <img src={processedImages.top} alt="Top" />
          </div>
        )}

      </div>
    </div>
  );
}
