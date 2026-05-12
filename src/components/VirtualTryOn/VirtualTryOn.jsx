import React, { useState, useEffect } from 'react';
import Mannequin from './Mannequin';
import { useToast } from '../shared/ToastContext';
import { getCategoryEmoji } from '../../utils/recommendations';
import './VirtualTryOn.css';

const SKIN_TONES = [
  { name: 'Fair', color: '#F9E4D4' },
  { name: 'Light', color: '#E5C298' },
  { name: 'Medium', color: '#D2A172' },
  { name: 'Tan', color: '#A57244' },
  { name: 'Deep', color: '#63392D' }
];

const BODY_TYPES = [
  { id: 'slim', label: 'Slim', icon: '👤' },
  { id: 'athletic', label: 'Athletic', icon: '💪' },
  { id: 'curvy', label: 'Curvy', icon: '⌛' }
];

const SLOT_CONFIG = [
  { key: 'top', label: 'Top', categories: ['top', 'dress'], order: 3 },
  { key: 'bottom', label: 'Bottom', categories: ['bottom'], order: 2 },
  { key: 'shoes', label: 'Shoes', categories: ['shoes'], order: 1 },
  { key: 'outerwear', label: 'Outerwear', categories: ['outerwear'], order: 4 },
];

export default function VirtualTryOn({ wardrobe = [] }) {
  const { addToast } = useToast();
  const [gender, setGender] = useState('female');
  const [skinTone, setSkinTone] = useState('#E5C298');
  const [bodyType, setBodyType] = useState('athletic');
  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    shoes: null,
    outerwear: null
  });
  const [activeSlot, setActiveSlot] = useState('top');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter wardrobe items for the active slot
  const currentSlotConfig = SLOT_CONFIG.find(s => s.key === activeSlot);
  const availableItems = wardrobe.filter(item => 
    currentSlotConfig.categories.includes(item.category)
  );

  const handleSelectItem = (item) => {
    setIsProcessing(true);
    // Simulate "Extraction" logic
    setTimeout(() => {
      setSelectedItems(prev => ({
        ...prev,
        [activeSlot]: item
      }));
      setIsProcessing(false);
      addToast(`Successfully fitted ${item.name}`, 'success');
    }, 800);
  };

  const removeItem = (slot) => {
    setSelectedItems(prev => ({ ...prev, [slot]: null }));
  };

  return (
    <div className="vto-premium-container">
      <div className="page-header">
        <h2>Virtual Try-On <span>Elite</span></h2>
        <p>Physically-accurate clothing simulation on your personalized avatar</p>
      </div>

      <div className="vto-grid">
        {/* Left: Customization Controls */}
        <div className="vto-controls">
          <section className="control-section">
            <h4>1. Personalize Avatar</h4>
            <div className="gender-selector">
              <button 
                className={gender === 'male' ? 'active' : ''} 
                onClick={() => setGender('male')}
              >♂ Male</button>
              <button 
                className={gender === 'female' ? 'active' : ''} 
                onClick={() => setGender('female')}
              >♀ Female</button>
            </div>

            <label>Skin Tone</label>
            <div className="skin-tone-grid">
              {SKIN_TONES.map(tone => (
                <button 
                  key={tone.color}
                  className={`tone-btn ${skinTone === tone.color ? 'active' : ''}`}
                  style={{ backgroundColor: tone.color }}
                  onClick={() => setSkinTone(tone.color)}
                  title={tone.name}
                />
              ))}
            </div>

            <label>Body Type</label>
            <div className="body-type-grid">
              {BODY_TYPES.map(type => (
                <button 
                  key={type.id}
                  className={`type-btn ${bodyType === type.id ? 'active' : ''}`}
                  onClick={() => setBodyType(type.id)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="control-section wardrobe-section">
            <h4>2. Select Clothing</h4>
            <div className="slot-tabs">
              {SLOT_CONFIG.map(slot => (
                <button 
                  key={slot.key}
                  className={`slot-tab ${activeSlot === slot.key ? 'active' : ''}`}
                  onClick={() => setActiveSlot(slot.key)}
                >
                  {slot.label}
                  {selectedItems[slot.key] && <span className="slot-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="items-picker">
              {availableItems.length === 0 ? (
                <div className="empty-picker">
                  <p>No items found for this category</p>
                </div>
              ) : (
                <div className="picker-grid">
                  {availableItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`picker-card ${selectedItems[activeSlot]?.id === item.id ? 'selected' : ''}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="item-img-wrap">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} />
                        ) : (
                          <span className="item-emoji">{getCategoryEmoji(item.category)}</span>
                        )}
                      </div>
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Center: The Live Preview */}
        <div className="vto-preview">
          <div className="preview-stage">
            {isProcessing && (
              <div className="vto-loader">
                <div className="scanner-line"></div>
                <span>Analyzing Fit...</span>
              </div>
            )}
            
            <div className={`mannequin-wrapper ${gender}`}>
              <Mannequin 
                gender={gender} 
                skinTone={skinTone} 
                bodyType={bodyType} 
              />
              
              {/* Layered Clothing */}
              <div className="clothing-layers">
                {Object.entries(selectedItems)
                  .filter(([_, item]) => item !== null)
                  .sort((a, b) => {
                    const orderA = SLOT_CONFIG.find(s => s.key === a[0]).order;
                    const orderB = SLOT_CONFIG.find(s => s.key === b[0]).order;
                    return orderA - orderB;
                  })
                  .map(([slot, item]) => (
                    <div 
                      key={slot} 
                      className={`clothing-layer layer-${slot} ${bodyType}`}
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="stage-floor"></div>

            {/* Action Overlay */}
            <div className="vto-actions">
               <button className="btn btn-primary" onClick={() => addToast('Outfit composition saved to favorites!', 'success')}>
                 ✨ Save this Look
               </button>
            </div>
          </div>

          <div className="selected-summary">
            {Object.entries(selectedItems).map(([slot, item]) => item && (
              <div key={slot} className="summary-pill">
                <span>{item.name}</span>
                <button onClick={() => removeItem(slot)}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
