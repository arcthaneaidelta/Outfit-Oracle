import { useAuth } from '../Auth/AuthContext';
import { useToast } from '../shared/ToastContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'wardrobe', label: 'Wardrobe', icon: '👗' },
  { id: 'outfit-builder', label: 'Outfit Builder', icon: '✏️' },
  { id: 'recommendations', label: 'Recommendations', icon: '✨' },
  { id: 'planner', label: 'Planner', icon: '📅' },
  { id: 'history', label: 'Wear History', icon: '📊' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
];

export default function Sidebar({ activeTab, onNavigate }) {
  const { user, userProfile, logout } = useAuth();
  const { addToast } = useToast();

  const handleLogout = async () => {
    await logout();
    addToast('Signed out successfully', 'info');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Outfit<span style={{ color: '#D4774A' }}>Oracle</span></h1>
        <p>Smart Style Assistant</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div style={{ padding: '12px', marginBottom: '8px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(247,241,232,0.8)', fontWeight: 500 }}>
            {userProfile?.name || user?.displayName || 'User'}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(247,241,232,0.4)', marginTop: '2px' }}>
            {userProfile?.city || 'No city set'}
          </div>
        </div>
        <button className="nav-item" onClick={handleLogout} style={{ width: '100%' }}>
          <span className="nav-icon">↩</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
