import { useState, useEffect, Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px', padding: '40px', fontFamily: 'DM Sans, sans-serif' }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif' }}>Something went wrong</h2>
          <p style={{ color: '#78716C', maxWidth: '500px', textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button onClick={() => window.location.reload()}
            style={{ padding: '10px 24px', background: '#C4622D', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { useAuth } from './components/Auth/AuthContext';
import LoadingScreen from './components/shared/LoadingScreen';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Sidebar from './components/shared/Sidebar';
import OracleDashboard from './components/Dashboard/OracleDashboard';
import Wardrobe from './components/Wardrobe/Wardrobe';
import OutfitBuilder from './components/OutfitBuilder/OutfitBuilder';
import Recommendations from './components/Recommendations/Recommendations';
import Planner from './components/Planner/Planner';
import WearHistory from './components/Wardrobe/WearHistory';
import Favorites from './components/Favorites/Favorites';
import ProfileSettings from './components/Dashboard/ProfileSettings';
import { useWardrobe, useOutfits, usePlanner, useWearHistory } from './hooks/useFirestore';

function AppShell({ theme, toggleTheme }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const { items, loading: wLoading, addItem, updateItem, deleteItem } = useWardrobe(user?.uid);
  const { outfits, loading: oLoading, saveOutfit, updateOutfit, deleteOutfit, toggleFavorite } = useOutfits(user?.uid);
  const { entries, loading: pLoading, planOutfit, removePlan } = usePlanner(user?.uid);
  const { history, loading: hLoading, logWear } = useWearHistory(user?.uid);

  // Timeout: if still loading after 6s, proceed anyway (e.g. Firestore rules blocking)
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 6000);
    return () => clearTimeout(t);
  }, []);

  const loading = !timedOut && (wLoading || oLoading || pLoading || hLoading);

  if (loading) {
    return (
      <div className={`app-layout ${theme === 'dark' ? 'dark-mode' : ''}`}>
        <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingScreen fullScreen={false} text="Syncing your wardrobe..." />
        </main>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OracleDashboard wardrobe={items} outfits={outfits} history={history} planner={entries} onNavigate={setActiveTab} theme={theme} toggleTheme={toggleTheme} />;
      case 'wardrobe':
        return <Wardrobe items={items} addItem={addItem} deleteItem={deleteItem} updateItem={updateItem} />;
      case 'outfit-builder':
        return <OutfitBuilder wardrobe={items} saveOutfit={saveOutfit} outfits={outfits} />;
      case 'recommendations':
        return <Recommendations outfits={outfits} wardrobe={items} history={history} planOutfit={planOutfit} toggleFavorite={toggleFavorite} />;
      case 'planner':
        return <Planner entries={entries} planOutfit={planOutfit} removePlan={removePlan} outfits={outfits} logWear={logWear} />;
      case 'history':
        return <WearHistory history={history} />;
      case 'favorites':
        return <Favorites outfits={outfits} wardrobe={items} toggleFavorite={toggleFavorite} planOutfit={planOutfit} />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return null;
    }
  };

  return (
    <div className={`app-layout ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [welcomeFinished, setWelcomeFinished] = useState(false);
  const [shouldRenderLoader, setShouldRenderLoader] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('ot-theme') || 'light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('ot-theme', next);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Ensure the welcome loading screen shows for at least 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeFinished(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Handle the transition from loading to app
  useEffect(() => {
    if (!authLoading && welcomeFinished) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRenderLoader(false);
      }, 800); // Matches the CSS fade-out duration
      return () => clearTimeout(timer);
    }
  }, [authLoading, welcomeFinished]);

  return (
    <>
      {shouldRenderLoader && (
        <LoadingScreen isExiting={isExiting} text="Preparing your style experience..." />
      )}
      
      {!user ? (
        showSignup 
          ? <Signup onSwitch={() => setShowSignup(false)} />
          : <Login onSwitch={() => setShowSignup(true)} />
      ) : (
        <ErrorBoundary><AppShell theme={theme} toggleTheme={toggleTheme} /></ErrorBoundary>
      )}
    </>
  );
}


