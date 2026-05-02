import { useState, useMemo } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useWeather, getTempCategory } from '../../hooks/useWeather';
import { getRecommendations, getCategoryEmoji, OCCASIONS, SEASONS } from '../../utils/recommendations';
import { useToast } from '../shared/ToastContext';

export default function Recommendations({ outfits, wardrobe, history, planOutfit, toggleFavorite }) {
  const { userProfile } = useAuth();
  const { weather } = useWeather(userProfile?.city);
  const { addToast } = useToast();
  const [occasion, setOccasion] = useState('Any');
  const [manualTemp, setManualTemp] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(null); // outfit to plan
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);

  const effectiveTemp = manualTemp !== '' ? parseInt(manualTemp) : weather?.temp;
  const effectiveWeather = manualTemp !== '' ? { temp: parseInt(manualTemp), condition: 'Manual', emoji: '🌡️' } : weather;

  const recommendations = useMemo(() => {
    return getRecommendations(outfits, {
      weather: effectiveWeather,
      occasion: occasion === 'Any' ? null : occasion,
      history,
      items: wardrobe,
    }, 12);
  }, [outfits, effectiveWeather, occasion, history, wardrobe]);

  const handlePlan = async () => {
    if (!showPlanModal || !planDate) return;
    try {
      await planOutfit(planDate, showPlanModal.id, showPlanModal.name);
      addToast(`Outfit planned for ${planDate}`, 'success');
      setShowPlanModal(null);
    } catch (e) {
      addToast('Failed to plan outfit', 'error');
    }
  };

  const handleFavorite = async (outfit) => {
    try {
      await toggleFavorite(outfit.id, outfit.isFavorite);
      addToast(outfit.isFavorite ? 'Removed from favorites' : 'Added to favorites ❤️', outfit.isFavorite ? 'info' : 'success');
    } catch (e) {
      addToast('Error updating favorites', 'error');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--sage)';
    if (score >= 60) return 'var(--gold)';
    return 'var(--terracotta)';
  };

  return (
    <div>
      <div className="page-header">
        <h2>Recommendations</h2>
        <p>Smart outfit suggestions based on your wardrobe, weather, and occasion</p>
      </div>

      {/* Filters */}
      <div className="rec-filters">
        {/* Weather Display */}
        {weather && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px', background: 'var(--white)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--cream-darker)', fontSize: '14px',
          }}>
            <span>{weather.emoji}</span>
            <span>{weather.temp !== null ? `${weather.temp}°C` : '—'}</span>
            <span style={{ color: 'var(--charcoal-muted)' }}>{weather.condition}</span>
          </div>
        )}

        {/* Manual temp override */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number" placeholder="Override temp (°C)" value={manualTemp}
            onChange={e => setManualTemp(e.target.value)}
            style={{ width: '160px', margin: 0 }}
          />
          {manualTemp && <button className="btn btn-ghost btn-sm" onClick={() => setManualTemp('')}>Clear</button>}
        </div>

        {/* Occasion filter */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Any', ...OCCASIONS.filter(o => o !== 'Any')].map(occ => (
            <button key={occ} className={`filter-chip ${occasion === occ ? 'active' : ''}`}
              onClick={() => setOccasion(occ)}>
              {occ}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {recommendations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✨</div>
          <h3>No recommendations yet</h3>
          <p>
            {outfits.length === 0
              ? 'Build some outfits first to get recommendations.'
              : 'Try relaxing your filters — no outfits match the current criteria.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--charcoal-muted)' }}>
            Showing {recommendations.length} outfit{recommendations.length !== 1 ? 's' : ''} · Sorted by match score
          </div>
          <div className="rec-grid">
            {recommendations.map(outfit => (
              <div key={outfit.id} className="rec-card">
                {/* Preview grid */}
                <div className="rec-card-preview">
                  {[outfit.top, outfit.bottom, outfit.shoes, outfit.outerwear || outfit.accessory].map((itemId, i) => {
                    const item = wardrobe.find(w => w.id === itemId);
                    return (
                      <div key={i} className="rec-card-item">
                        {item?.imageUrl
                          ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : item ? getCategoryEmoji(item.category) : '—'}
                      </div>
                    );
                  })}
                </div>

                <div className="rec-card-body">
                  <div className="rec-card-name">{outfit.name}</div>

                  {/* Score bar */}
                  <div className="rec-card-score">
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${outfit.score}%`, background: getScoreColor(outfit.score) }} />
                    </div>
                    <span className="score-text" style={{ color: getScoreColor(outfit.score) }}>{outfit.score}%</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {outfit.occasion && <span className="tag tag-terracotta" style={{ fontSize: '11px' }}>{outfit.occasion}</span>}
                    {outfit.season && <span className="tag tag-sage" style={{ fontSize: '11px' }}>{outfit.season}</span>}
                    {outfit.isFavorite && <span className="tag tag-gold" style={{ fontSize: '11px' }}>❤️ Saved</span>}
                  </div>

                  {/* Reasons */}
                  {outfit.reasons.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--charcoal-muted)', marginBottom: '12px' }}>
                      {outfit.reasons.slice(0, 2).join(' · ')}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => { setShowPlanModal(outfit); setPlanDate(new Date().toISOString().split('T')[0]); }}>
                      Plan
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleFavorite(outfit)}
                      title={outfit.isFavorite ? 'Remove favorite' : 'Add favorite'}>
                      {outfit.isFavorite ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(null)}>
          <div className="modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Plan Outfit</h3>
              <button className="modal-close" onClick={() => setShowPlanModal(null)}>×</button>
            </div>
            <p style={{ color: 'var(--charcoal-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Schedule <strong>{showPlanModal.name}</strong> for a specific date.
            </p>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Date</label>
              <input type="date" value={planDate} onChange={e => setPlanDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setShowPlanModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePlan}>Confirm Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
