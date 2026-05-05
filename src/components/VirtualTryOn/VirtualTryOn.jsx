import { useState } from 'react';
import AvatarPreview from './AvatarPreview';
import WardrobeSelector from './WardrobeSelector';
import { useToast } from '../shared/ToastContext';

export default function VirtualTryOn({ wardrobe, saveOutfit }) {
  const { addToast } = useToast();
  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    shoes: null,
    outerwear: null,
  });

  const [avatarSettings, setAvatarSettings] = useState({
    skinTone: '#e3c2a4', // Default medium-light
    bodyType: 'average', // slim, average, muscular, plus-size
  });

  const [saving, setSaving] = useState(false);
  const [outfitName, setOutfitName] = useState('');

  const handleSelectItem = (categorySlot, item) => {
    setSelectedItems((prev) => {
      // Toggle off if same item selected
      if (prev[categorySlot]?.id === item?.id) {
        return { ...prev, [categorySlot]: null };
      }
      return { ...prev, [categorySlot]: item };
    });
  };

  const handleSaveOutfit = async () => {
    if (!selectedItems.top && !selectedItems.bottom && !selectedItems.outerwear) {
      addToast('Please select at least one clothing item.', 'error');
      return;
    }
    if (!outfitName.trim()) {
      addToast('Please provide an outfit name.', 'error');
      return;
    }

    setSaving(true);
    try {
      const outfitData = {
        name: outfitName,
        occasion: 'Casual',
        season: 'all',
        top: selectedItems.top?.id || null,
        bottom: selectedItems.bottom?.id || null,
        shoes: selectedItems.shoes?.id || null,
        outerwear: selectedItems.outerwear?.id || null,
      };
      
      await saveOutfit(outfitData);
      addToast('Outfit saved successfully!', 'success');
      setOutfitName('');
      // Optionally reset selections, but maybe users want to keep tweaking
    } catch (e) {
      addToast('Failed to save outfit: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="virtual-tryon-page">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Virtual Try-On</h2>
          <p>Mix and match your wardrobe to visualize combinations.</p>
        </div>
      </div>

      <div className="vto-layout">
        <div className="vto-preview-panel card">
          <AvatarPreview 
            selectedItems={selectedItems} 
            avatarSettings={avatarSettings} 
            onSettingsChange={(settings) => setAvatarSettings(prev => ({ ...prev, ...settings }))}
          />
        </div>

        <div className="vto-controls-panel card">
          <WardrobeSelector 
            wardrobe={wardrobe} 
            selectedItems={selectedItems} 
            onSelectItem={handleSelectItem} 
          />
          
          <div className="vto-save-section">
            <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Save as Outfit</h3>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Name this look..." 
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={saving}
              onClick={handleSaveOutfit}
            >
              {saving ? 'Saving...' : '💾 Save Outfit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
