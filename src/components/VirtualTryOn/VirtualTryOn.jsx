import React, { useState, useEffect } from 'react';
import WardrobeSelector from './WardrobeSelector';
import AvatarPreview from './AvatarPreview';
import ControlPanel from './ControlPanel';
import { useToast } from '../shared/ToastContext';
import { processClothingImage } from '../../utils/processImage';
import { analyzeGarment } from '../../utils/autoFit';

export default function VirtualTryOn({ wardrobe, saveOutfit }) {
  const { addToast } = useToast();
  
  // 1. Clothing State
  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    shoes: null,
    outerwear: null,
  });

  const [processedImages, setProcessedImages] = useState({
    top: null,
    bottom: null,
    shoes: null,
    outerwear: null,
  });

  const [autoFitStyles, setAutoFitStyles] = useState({
    top: {},
    bottom: {},
    shoes: {},
    outerwear: {},
  });

  // 2. Avatar State
  const [avatarSettings, setAvatarSettings] = useState({
    skinTone: '#fcdfb6', // Default: Light
    bodyType: 'regular',  // Default: Regular
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [outfitName, setOutfitName] = useState('');

  const handleSelectItem = async (category, item) => {
    let categorySlot = category.toLowerCase();
    if (categorySlot === 'pants' || categorySlot === 'bottoms') categorySlot = 'bottom';
    if (categorySlot === 'shirts' || categorySlot === 'tops') categorySlot = 'top';

    // Toggle off if same item selected
    if (selectedItems[categorySlot]?.id === item.id) {
      setSelectedItems(prev => ({ ...prev, [categorySlot]: null }));
      setProcessedImages(prev => ({ ...prev, [categorySlot]: null }));
      setAutoFitStyles(prev => ({ ...prev, [categorySlot]: {} }));
      return;
    }

    setSelectedItems(prev => ({ ...prev, [categorySlot]: item }));

    if (item.imageUrl) {
      setIsProcessing(true);
      try {
        // Remove background locally
        const transparentUrl = await processClothingImage(item.imageUrl);
        setProcessedImages(prev => ({ ...prev, [categorySlot]: transparentUrl }));
        
        // Calculate auto-fit coordinates (the 2D logic)
        const styles = await analyzeGarment(transparentUrl, categorySlot);
        setAutoFitStyles(prev => ({ ...prev, [categorySlot]: styles }));
      } catch (err) {
        addToast("Error processing item.", "error");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSave = () => {
    if (!selectedItems.top && !selectedItems.bottom && !selectedItems.shoes) {
      addToast('Select some items first!', 'warning');
      return;
    }
    if (!outfitName.trim()) {
      addToast('Give your outfit a name.', 'warning');
      return;
    }
    
    saveOutfit({
      name: outfitName,
      items: selectedItems,
      avatarSettings,
      processedImages,
      autoFitStyles
    });
    
    setOutfitName('');
    addToast('Outfit saved successfully!', 'success');
  };

  return (
    <div className="vto-layout-v2">
      {/* LEFT PANEL: Wardrobe */}
      <div className="vto-panel vto-left-panel glass-panel">
        <h3 className="panel-title">Wardrobe</h3>
        <WardrobeSelector 
          wardrobe={wardrobe} 
          selectedItems={selectedItems} 
          onSelectItem={handleSelectItem} 
        />
      </div>

      {/* CENTER PANEL: Avatar Display */}
      <div className="vto-center-panel">
        <div className="vto-stage-container glass-panel">
          {isProcessing && (
            <div className="vto-loader-overlay">
              <div className="vto-spinner"></div>
              <p>Fitting Garment...</p>
            </div>
          )}
          
          <AvatarPreview 
            selectedItems={selectedItems} 
            processedImages={processedImages}
            autoFitStyles={autoFitStyles}
            avatarSettings={avatarSettings}
          />
        </div>

        <div className="vto-save-controls glass-panel">
          <input 
            type="text" 
            placeholder="Name your outfit..." 
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="vto-input"
          />
          <button className="vto-btn-primary" onClick={handleSave}>
            <i className="fas fa-save"></i> Save Look
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Customization */}
      <div className="vto-panel vto-right-panel glass-panel">
        <h3 className="panel-title">Avatar</h3>
        <ControlPanel 
          settings={avatarSettings} 
          onChange={(s) => setAvatarSettings(prev => ({ ...prev, ...s }))}
          onReset={() => {
             setSelectedItems({ top: null, bottom: null, shoes: null, outerwear: null });
             setProcessedImages({ top: null, bottom: null, shoes: null, outerwear: null });
          }}
        />
      </div>
    </div>
  );
}