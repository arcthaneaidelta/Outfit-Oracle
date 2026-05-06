import React, { useState, useEffect } from 'react';
import WardrobeSelector from './WardrobeSelector';
import AvatarPreview from './AvatarPreview';
import { useToast } from '../shared/ToastContext';
import { processClothingImage } from '../../utils/processImage';
import { generateAITryOn, MODELS } from '../../utils/ootDiffusionApi';

export default function VirtualTryOn({ wardrobe, saveOutfit }) {
  const { addToast } = useToast();
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

  const [gender, setGender] = useState('female');
  const [generatedModelImage, setGeneratedModelImage] = useState(null);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [outfitName, setOutfitName] = useState('');

  // When gender changes, reset the generated image to the new default model
  useEffect(() => {
    setGeneratedModelImage(null);
  }, [gender]);

  const handleSelectItem = async (category, item) => {
    // Map custom categories to available slots
    let categorySlot = category.toLowerCase();
    if (categorySlot === 'pants' || categorySlot === 'bottoms') categorySlot = 'bottom';
    if (categorySlot === 'shirts' || categorySlot === 'tops') categorySlot = 'top';

    // Toggle off if same item selected
    if (selectedItems[categorySlot]?.id === item.id) {
      setSelectedItems(prev => ({ ...prev, [categorySlot]: null }));
      setProcessedImages(prev => ({ ...prev, [categorySlot]: null }));
      return;
    }

    if (isAIGenerating) {
      addToast("Please wait for the current AI generation to finish.", "warning");
      return;
    }

    setSelectedItems(prev => ({ ...prev, [categorySlot]: item }));

    if (item.imageUrl) {
      setIsProcessing(true);
      const transparentUrl = await processClothingImage(item.imageUrl);
      setProcessedImages(prev => ({ ...prev, [categorySlot]: transparentUrl }));
      setIsProcessing(false);

      if (categorySlot !== 'shoes') {
        setIsAIGenerating(true);
        addToast("Generative AI is fitting the garment... (takes ~20s)", "info");
        try {
          // Pass current model (or default for gender)
          const currentBase = generatedModelImage || MODELS[gender];
          const newAiImage = await generateAITryOn(transparentUrl, categorySlot, currentBase);
          if (newAiImage) {
            setGeneratedModelImage(newAiImage);
            addToast("AI Fitting Complete!", "success");
          }
        } catch (err) {
          addToast("AI Server is busy. Try again in a moment.", "error");
        } finally {
          setIsAIGenerating(false);
        }
      }
    } else {
      setProcessedImages(prev => ({ ...prev, [categorySlot]: null }));
    }
  };

  const handleSave = () => {
    if (!selectedItems.top && !selectedItems.bottom && !selectedItems.outerwear) {
      addToast('Please select at least one main clothing item.', 'error');
      return;
    }
    if (!outfitName.trim()) {
      addToast('Please give your outfit a name.', 'warning');
      return;
    }
    
    saveOutfit({
      name: outfitName,
      items: selectedItems,
      generatedImage: generatedModelImage 
    });
    
    setOutfitName('');
    addToast('Outfit saved successfully!', 'success');
  };

  return (
    <div className="vto-layout">
      {/* LEFT PANEL - AVATAR & CONTROLS */}
      <div className="vto-main-panel glass-panel">
        <div className="vto-avatar-section">
          
          {/* Gender Toggle */}
          <div className="vto-gender-toggle">
             <button 
               className={gender === 'female' ? 'active' : ''} 
               onClick={() => setGender('female')}
             >Girl</button>
             <button 
               className={gender === 'male' ? 'active' : ''} 
               onClick={() => setGender('male')}
             >Boy</button>
          </div>

          {(isProcessing || isAIGenerating) && (
            <div className="vto-processing-overlay">
              <div className="vto-spinner"></div>
              <p>{isAIGenerating ? "AI is generating photorealistic fit..." : "Extracting Garment..."}</p>
            </div>
          )}
          
          <AvatarPreview 
            selectedItems={selectedItems} 
            generatedModelImage={generatedModelImage}
            defaultModel={MODELS[gender]}
          />
        </div>
      </div>

      {/* RIGHT PANEL - WARDROBE SELECTION */}
      <div className="vto-side-panel">
        <WardrobeSelector 
          wardrobe={wardrobe} 
          selectedItems={selectedItems} 
          onSelectItem={handleSelectItem} 
        />
        
        <div className="vto-save-panel glass-panel">
          <h4>Save as Outfit</h4>
          <input 
            type="text" 
            placeholder="Name this look..." 
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="vto-input"
          />
          <button className="vto-save-btn" onClick={handleSave}>
            <i className="fas fa-save"></i> Save Outfit
          </button>
        </div>
      </div>
    </div>
  );
}