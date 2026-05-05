import { useState } from 'react';
import { getCategoryEmoji } from '../../utils/recommendations';

const CATEGORY_TABS = [
  { id: 'top', label: 'Tops', filter: ['top', 'dress'] },
  { id: 'bottom', label: 'Bottoms', filter: ['bottom', 'dress'] },
  { id: 'outerwear', label: 'Outerwear', filter: ['outerwear'] },
  { id: 'shoes', label: 'Shoes', filter: ['shoes'] },
];

export default function WardrobeSelector({ wardrobe, selectedItems, onSelectItem }) {
  const [activeTab, setActiveTab] = useState('top');

  const activeConfig = CATEGORY_TABS.find(t => t.id === activeTab);
  const filteredItems = wardrobe.filter(item => activeConfig.filter.includes(item.category));

  return (
    <div className="vto-wardrobe-selector">
      <div className="vto-tabs">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab.id}
            className={`vto-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {selectedItems[tab.id] && <span className="vto-tab-indicator" />}
          </button>
        ))}
      </div>

      <div className="vto-items-grid">
        {filteredItems.length === 0 ? (
          <div className="vto-empty-state">
            <p>No items found for {activeConfig.label}.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isSelected = selectedItems[activeTab]?.id === item.id;
            
            return (
              <div 
                key={item.id} 
                className={`vto-item-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectItem(activeTab, item)}
              >
                <div className="vto-item-image-container">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <span className="vto-emoji-placeholder">{getCategoryEmoji(item.category)}</span>
                  )}
                  {isSelected && <div className="vto-check-badge">✓</div>}
                </div>
                <div className="vto-item-name">{item.name}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
