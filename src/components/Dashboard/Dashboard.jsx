import { useMemo } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useWeather } from '../../hooks/useWeather';
import { getRecommendations, getCategoryEmoji } from '../../utils/recommendations';

export default function Dashboard({ wardrobe, outfits, history, planner, onNavigate }) {
  const { userProfile } = useAuth();
  const { weather } = useWeather(userProfile?.city);

  const today = new Date().toISOString().split('T')[0];
  const todayPlan = planner.find(e => e.date === today);
  const todayOutfit = todayPlan ? outfits.find(o => o.id === todayPlan.outfitId) : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const hasTops = wardrobe.some(i => i.category === 'top' || i.category === 'dress');
  const hasBottoms = wardrobe.some(i => i.category === 'bottom' || i.category === 'dress');
  const hasShoes = wardrobe.some(i => i.category === 'shoes');
  const canBuildOutfit = hasTops && hasBottoms && hasShoes;

  const topRecommendations = useMemo(() => {
    return getRecommendations(outfits, { weather, occasion: 'Any', history, items: wardrobe }, 3);
  }, [outfits, weather, history, wardrobe]);

  const recentHistory = history.slice(0, 5);

  const stats = [
    { icon: '👗', value: wardrobe.length, label: 'Clothing Items' },
    { icon: '✨', value: outfits.length, label: 'Outfits' },
    { icon: '📅', value: planner.length, label: 'Planned Days' },
    { icon: '📊', value: history.length, label: 'Outfit Wears' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2 style={{ fontFamily: 'var(--font-display)' }}>
            {greeting()}, {userProfile?.name?.split(' ')[0] || 'there'} 👋
          </h2>
          <p>Here's your style overview for today</p>
        </div>

        {weather && (
          <div className="weather-badge">
            <span style={{ fontSize: '28px' }}>{weather.emoji}</span>
            <div>
              {weather.temp !== null ? (
                <div className="weather-temp">{weather.temp}°C</div>
              ) : null}
              <div style={{ fontSize: '12px', color: 'var(--charcoal-muted)' }}>
                {weather.condition} · {userProfile?.city}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-row">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Onboarding hints */}
      {wardrobe.length === 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div className="onboarding-hint">
            <span className="onboarding-hint-icon">👕</span>
            <div className="onboarding-hint-text">
              <strong>Start by adding clothing items.</strong> Head to your Wardrobe to upload your first piece.
              <button className="btn btn-sm btn-primary" style={{ marginLeft: '12px' }} onClick={() => onNavigate('wardrobe')}>
                Open Wardrobe
              </button>
            </div>
          </div>
        </div>
      )}
      {wardrobe.length > 0 && !canBuildOutfit && (
        <div style={{ marginBottom: '24px' }}>
          <div className="onboarding-hint">
            <span className="onboarding-hint-icon">💡</span>
            <div className="onboarding-hint-text">
              <strong>You need at least a top, bottom, and shoes</strong> to start building outfits.
              {!hasTops && <span> Add a top.</span>}
              {!hasBottoms && <span> Add a bottom.</span>}
              {!hasShoes && <span> Add shoes.</span>}
            </div>
          </div>
        </div>
      )}
      {canBuildOutfit && outfits.length === 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div className="onboarding-hint">
            <span className="onboarding-hint-icon">✨</span>
            <div className="onboarding-hint-text">
              <strong>Your wardrobe is ready!</strong> Now create your first outfit in the Outfit Builder.
              <button className="btn btn-sm btn-primary" style={{ marginLeft: '12px' }} onClick={() => onNavigate('outfit-builder')}>
                Build Outfit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Today's Outfit */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Today's Outfit</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('planner')}>
                Plan →
              </button>
            </div>
            {todayOutfit ? (
              <div>
                <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{todayOutfit.name}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {todayOutfit.occasion && <span className="tag tag-terracotta">{todayOutfit.occasion}</span>}
                  {todayOutfit.season && <span className="tag tag-sage">{todayOutfit.season}</span>}
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  {[todayOutfit.top, todayOutfit.bottom, todayOutfit.shoes].filter(Boolean).map(itemId => {
                    const item = wardrobe.find(i => i.id === itemId);
                    return item ? (
                      <div key={itemId} className="tag" style={{ fontSize: '20px', padding: '8px 12px' }}>
                        {getCategoryEmoji(item.category)}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '24px', minHeight: 'auto' }}>
                <div className="empty-state-icon">📅</div>
                <p style={{ margin: 0 }}>No outfit planned for today</p>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('planner')}>Plan Now</button>
              </div>
            )}
          </div>

          {/* Top Recommendations */}
          {topRecommendations.length > 0 && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px' }}>Top Picks Today</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('recommendations')}>
                  View All →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topRecommendations.map(outfit => (
                  <div key={outfit.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '12px', background: 'var(--cream)', borderRadius: 'var(--radius-md)',
                  }}>
                    <div style={{ fontSize: '28px' }}>
                      {[outfit.top, outfit.bottom, outfit.shoes].filter(Boolean).map(id => {
                        const item = wardrobe.find(i => i.id === id);
                        return item ? getCategoryEmoji(item.category) : '';
                      }).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{outfit.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--charcoal-muted)' }}>Score: {outfit.score}%</div>
                    </div>
                    <div className="score-bar" style={{ width: '80px' }}>
                      <div className="score-fill" style={{ width: `${outfit.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Recent Wear History */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Recent Wears</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('history')}>
                All →
              </button>
            </div>
            {recentHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentHistory.map(h => {
                  const d = h.wornAt?.toDate ? h.wornAt.toDate() : new Date();
                  return (
                    <div key={h.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--cream-dark)' }}>
                      <div style={{ textAlign: 'center', minWidth: '36px' }}>
                        <div style={{ fontSize: '16px', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.getDate()}</div>
                        <div style={{ fontSize: '10px', color: 'var(--charcoal-muted)', textTransform: 'uppercase' }}>
                          {d.toLocaleString('en', { month: 'short' })}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--charcoal)' }}>{h.outfitName}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '20px', minHeight: 'auto' }}>
                <p style={{ margin: 0, fontSize: '13px' }}>No wear history yet</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '+ Add Clothing', tab: 'wardrobe', icon: '👕' },
                { label: '✏️ Build Outfit', tab: 'outfit-builder', icon: '✏️' },
                { label: '✨ Get Recs', tab: 'recommendations', icon: '✨' },
                { label: '📅 Plan Week', tab: 'planner', icon: '📅' },
              ].map(a => (
                <button key={a.tab} className="btn btn-secondary" style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={() => onNavigate(a.tab)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
