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
        <button 
          className={`sidebar-user-area ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onNavigate('profile')}
        >
          <div className="user-info">
            <div className="user-name">
              {userProfile?.name || user?.displayName || 'User'}
            </div>
            <div className="user-city">
              {userProfile?.city || 'No city set'}
            </div>
          </div>
        </button>
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon">↩</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
