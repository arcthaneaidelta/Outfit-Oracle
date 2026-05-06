import React from 'react';
import { DEFAULT_MODEL_IMG_URL } from '../../utils/ootDiffusionApi';
import { getCategoryEmoji } from '../../utils/recommendations';

export default function AvatarPreview({ selectedItems, generatedModelImage }) {
  
  // Use the AI generated image if available, otherwise fallback to the high-quality default model
  const displayImage = generatedModelImage || DEFAULT_MODEL_IMG_URL;

  return (
    <div className="vto-preview-container" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'red', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
        GENERATIVE AI PREVIEW MODE
      </div>
      <div className="vto-ai-stage" style={{ width: '100%', maxWidth: '350px', position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        {/* Photorealistic AI Output */}
        <img 
          src={displayImage} 
          alt="AI Virtual Try-On Model" 
          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
        />

        {/* Since AI doesn't handle shoes natively, we display them as an accessory badge */}
        {selectedItems.shoes && (
          <div className="vto-accessory-badge" style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: '#333', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
            <span>{getCategoryEmoji(selectedItems.shoes.category)}</span>
            <span>Wearing Shoes</span>
          </div>
        )}

      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        <p><i className="fas fa-magic"></i> Powered by OOTDiffusion Generative AI</p>
      </div>
      
    </div>
  );
}
