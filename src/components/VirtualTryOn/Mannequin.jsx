import React from 'react';

/**
 * Realistic Mannequin Component
 * Uses high-quality 3D rendered mannequin assets with dynamic tinting.
 */
export default function Mannequin({ 
  gender = 'female', 
  skinTone = '#E5C298', 
  bodyType = 'athletic'
}) {
  // Mapping generated images
  const maleImg = "/male-mannequin.png";
  const femaleImg = "/female-mannequin.png";

  const currentImg = gender === 'male' ? maleImg : femaleImg;

  // Calculate HSL shift for skin tone
  // We'll use CSS filters to tint the neutral light beige mannequin
  const getFilter = () => {
    // This is a simplified mapping. In a real app, we'd use a more complex color matrix.
    if (skinTone === '#F9E4D4') return 'sepia(0.2) brightness(1.1)'; // Fair
    if (skinTone === '#E5C298') return 'sepia(0.3) brightness(1.0)'; // Light
    if (skinTone === '#D2A172') return 'sepia(0.5) brightness(0.9)'; // Medium
    if (skinTone === '#A57244') return 'sepia(0.7) brightness(0.7) saturate(1.2)'; // Tan
    if (skinTone === '#63392D') return 'sepia(0.8) brightness(0.4) saturate(1.5)'; // Deep
    return 'none';
  };

  return (
    <div className={`realistic-mannequin ${bodyType}`}>
      <img 
        src={currentImg} 
        alt="Mannequin" 
        style={{ 
          filter: getFilter(),
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }} 
      />
      {/* Anatomical Overlay for better lighting consistency */}
      <div className="mannequin-shading"></div>
    </div>
  );
}
