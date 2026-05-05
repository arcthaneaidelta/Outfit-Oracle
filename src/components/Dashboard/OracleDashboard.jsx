// Animated Theme Toggle version
import { useMemo } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useWeather } from '../../hooks/useWeather';
import { getRecommendations, getCategoryEmoji } from '../../utils/recommendations';
import { useToast } from '../shared/ToastContext';

export default function Dashboard({ wardrobe, outfits, history, planner, onNavigate, theme, toggleTheme }) {
  const { userProfile } = useAuth();
  const { addToast } = useToast();
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

  const stats = [
    { icon: '👗', value: wardrobe.length, label: 'CLOTHING ITEMS', hint: 'Add items to get started' },
    { icon: '✨', value: outfits.length, label: 'OUTFITS', hint: 'Create your first outfit' },
    { icon: '📅', value: planner.length, label: 'PLANNED DAYS', hint: 'Plan your looks ahead' },
    { icon: '📊', value: history.length, label: 'OUTFIT WEARS', hint: 'Track your style journey' },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Utility Bar */}
      <div className="dashboard-top-bar">
        <div className="utility-actions">
          <div className="theme-animation-wrapper" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <div className="icon-clipper">
              <div className="rotating-icons" style={{ '--rotation': theme === 'dark' ? '180' : '0' }}>
                <div className="theme-icon-item moon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6.5 6.5 0 0 1 5 11.5 9 9 0 1 0-5-11.5z"/></svg>
                </div>
                <div className="theme-icon-item sun">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </div>
              </div>
            </div>
          </div>
          <button className="notification-btn" onClick={() => addToast('You have no new style alerts', 'info')}>
            <span className="icon">🔔</span>
            <span className="dot" />
          </button>
        </div>
      </div>

      {/* Hero Greeting */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h2 className="display-title">
            {greeting()}, {userProfile?.name?.split(' ')[0] || 'there'} 👋
          </h2>
          <p className="sub-greeting">Here's your style overview for today.</p>
        </div>

        {weather && (
          <div className="weather-card-premium">
            <div className="weather-main">
              <span className="weather-icon-large">{weather.emoji}</span>
              <div className="weather-details">
                <div className="temp-display">{weather.temp || '--'}°C</div>
                <div className="condition-text">{weather.condition} · {userProfile?.city || 'Location'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stylized Stats Row */}
      <div className="stats-row-premium">
        {stats.map(s => (
          <div key={s.label} className="stat-card-premium">
            <div className="stat-card-inner">
              <div className="stat-icon-circle">{s.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
            <div className="stat-hint">{s.hint}</div>
          </div>
        ))}
      </div>

      {/* Main Banner */}
      <div className="dashboard-banner-onboarding">
        <div className="banner-left">
          <div className="banner-icon-bg">👕</div>
          <div className="banner-text">
            <h3>Start by adding clothing items.</h3>
            <p>Head to your Wardrobe to upload your first piece.</p>
          </div>
        </div>
        <button className="banner-btn" onClick={() => onNavigate('wardrobe')}>
          <span className="icon">👗</span> Open Wardrobe <span>&gt;</span>
        </button>
        <div className="banner-decoration" />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid-premium">
        {/* Today's Outfit Card */}
        <div className="card-premium">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">👕</span>
              <h3>Today's Outfit</h3>
            </div>
            <button className="card-action-link" onClick={() => onNavigate('planner')}>
              <span className="icon">📅</span> Plan Today
            </button>
          </div>
          
          <div className="card-body">
            {todayOutfit ? (
              <div className="outfit-preview-active">
                {/* Active outfit view */}
                <div className="outfit-info">
                   <h4>{todayOutfit.name}</h4>
                   <div className="outfit-tags">
                     <span className="tag-pill">{todayOutfit.occasion}</span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="empty-state-card">
                <div className="empty-illustration">
                  <div className="hanger-icon">👕</div>
                </div>
                <p className="empty-text">No outfit planned yet</p>
                <p className="empty-subtext">Plan your look for today and stay stylish!</p>
                <button className="btn-premium-action" onClick={() => onNavigate('planner')}>
                  Plan Your Outfit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Wears Card */}
        <div className="card-premium">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🕒</span>
              <h3>Recent Wears</h3>
            </div>
            <button className="card-action-link" onClick={() => onNavigate('history')}>
              View All
            </button>
          </div>
          
          <div className="card-body">
            {history.length > 0 ? (
              <div className="recent-wears-list">
                {/* List items would go here */}
              </div>
            ) : (
              <div className="empty-state-card">
                <div className="empty-illustration-circle">
                  <span className="icon">🕒</span>
                </div>
                <p className="empty-text">No wear history yet</p>
                <p className="empty-subtext">Start wearing your outfits and track your style journey.</p>
              </div>
            )}
          </div>
        </div>

        {/* Style Insights Card */}
        <div className="card-premium">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">✨</span>
              <h3>Style Insights</h3>
            </div>
          </div>
          
          <div className="card-body insight-body">
            <div className="insight-item">
              <div className="insight-icon-wrap orange">💡</div>
              <div className="insight-text">
                <h4>Add items to unlock insights</h4>
                <p>The more you add and wear, the better your recommendations!</p>
              </div>
            </div>
            
            <div className="insight-item">
              <div className="insight-icon-wrap red">🎯</div>
              <div className="insight-text">
                <h4>Smart Recommendations</h4>
                <p>Personalized outfit ideas based on your style and preferences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
