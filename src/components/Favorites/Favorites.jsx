import { getCategoryEmoji } from '../../utils/recommendations';
import { useToast } from '../shared/ToastContext';

export default function Favorites({ outfits, wardrobe, toggleFavorite, planOutfit }) {
  const { addToast } = useToast();
  const favorites = outfits.filter(o => o.isFavorite);

  const handleUnfavorite = async (outfit) => {
    try {
      await toggleFavorite(outfit.id, true);
      addToast('Removed from favorites', 'info');
    } catch {
      addToast('Error', 'error');
    }
  };

  const handlePlanToday = async (outfit) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await planOutfit(today, outfit.id, outfit.name);
      addToast(`"${outfit.name}" planned for today!`, 'success');
    } catch {
      addToast('Failed to plan', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Favorites</h2>
        <p>Your saved looks for quick access</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h3>No favorites yet</h3>
          <p>Heart outfits from the Recommendations page to save your favorites here.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(outfit => (
            <div key={outfit.id} className="fav-card">
              {/* Preview */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
                aspectRatio: '1', background: 'var(--cream-dark)',
              }}>
                {[outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear || outfit.accessory].map((itemId, i) => {
                  const item = wardrobe.find(w => w.id === itemId);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '32px', background: 'var(--cream-darker)',
                      borderRight: i % 2 === 0 ? '1px solid var(--cream-darker)' : 'none',
                      borderBottom: i < 2 ? '1px solid var(--cream-darker)' : 'none',
                      overflow: 'hidden',
                    }}>
                      {item?.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : item ? getCategoryEmoji(item.category) : '—'}
                    </div>
                  );
                })}
              </div>

              <button className="fav-heart" onClick={() => handleUnfavorite(outfit)} title="Remove favorite">
                ❤️
              </button>

              <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>{outfit.name}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {outfit.occasion && <span className="tag tag-terracotta" style={{ fontSize: '11px' }}>{outfit.occasion}</span>}
                  {outfit.season && <span className="tag tag-sage" style={{ fontSize: '11px' }}>{outfit.season}</span>}
                </div>
                <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handlePlanToday(outfit)}>
                  Plan for Today
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
