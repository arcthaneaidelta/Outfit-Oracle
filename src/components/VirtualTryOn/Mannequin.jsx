import React from 'react';

/**
 * Mannequin Component
 * A customizable SVG-based mannequin for virtual try-on.
 * Supports skin tone, body type (slim, athletic, curvy), and gender.
 */
export default function Mannequin({ 
  gender = 'female', 
  skinTone = '#E5C298', 
  bodyType = 'athletic',
  scale = 1
}) {
  // Body type path adjustments (simplified logic)
  const getBodyPath = () => {
    if (gender === 'female') {
      if (bodyType === 'slim') return "M12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 5c-1.1 0-2 .9-2 2v6h1v6h2v-6h2v6h2v-6h1v-6c0-1.1-.9-2-2-2h-2z";
      if (bodyType === 'curvy') return "M12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3 5c-1.1 0-2 .9-2 2v6h1c0 2 1 4 2 6h4c1-2 2-4 2-6h1v-6c0-1.1-.9-2-2-2H9z";
      return "M12 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2.5 5c-1.1 0-2 .9-2 2v6h1.5v6h2v-6h2v6h2v-6h1.5v-6c0-1.1-.9-2-2-2h-3z";
    } else {
      // Male paths
      if (bodyType === 'slim') return "M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 5c-1.1 0-2 .9-2 2v7h1v6h2v-6h2v6h2v-6h1V9c0-1.1-.9-2-2-2h-2z";
      return "M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3 5c-1.1 0-2 .9-2 2v7h2v6h2v-6h2v6h2v-6h2V9c0-1.1-.9-2-2-2H9z";
    }
  };

  return (
    <div className="mannequin-container" style={{ transform: `scale(${scale})`, transition: 'all 0.4s ease' }}>
      <svg 
        viewBox="0 0 24 24" 
        width="100%" 
        height="100%" 
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: skinTone, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: adjustColor(skinTone, -20), stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path 
          d={getBodyPath()} 
          fill="url(#skinGrad)" 
          stroke={adjustColor(skinTone, -40)}
          strokeWidth="0.2"
        />
        {/* Anatomical shading to make it look "human-like" and not just a flat shape */}
        <path 
          d={getBodyPath()} 
          fill="black" 
          fillOpacity="0.05"
          transform="translate(0.2, 0.2)"
        />
      </svg>
    </div>
  );
}

// Helper to darken colors for gradients/strokes
function adjustColor(hex, amt) {
  let usePound = false;
  if (hex[0] === "#") {
    hex = hex.slice(1);
    usePound = true;
  }
  let num = parseInt(hex, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255; else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}
