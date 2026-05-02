import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../shared/ToastContext';

const STYLE_PREFS = ['Casual', 'Formal', 'Streetwear', 'Minimalist', 'Bohemian', 'Classic', 'Sporty', 'Eclectic'];

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '', email: '', password: '', city: '', gender: '', stylePrefs: [],
  });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const togglePref = (pref) => {
    setForm(f => ({
      ...f,
      stylePrefs: f.stylePrefs.includes(pref)
        ? f.stylePrefs.filter(p => p !== pref)
        : [...f.stylePrefs, pref],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      addToast('Account created! Welcome to OutfitOracle.', 'success');
    } catch (err) {
      addToast(err.message.replace('Firebase: ', '').replace(/ \(auth\/.*\)/, ''), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">Outfit<span>Oracle</span></div>
          <p className="auth-tagline">
            Join thousands who dress smarter. Your wardrobe, your weather, your style — all in one place.
          </p>
          <div className="auth-features">
            {[
              ['🌦️', 'Real-time weather integration'],
              ['🎯', 'Occasion-based outfit matching'],
              ['📊', 'Wear tracking & analytics'],
              ['❤️', 'Save your favorite looks'],
            ].map(([icon, text]) => (
              <div key={text} className="auth-feature">
                <div className="auth-feature-icon">{icon}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2>Create account</h2>
          <p>Set up your OutfitOracle profile</p>

          <form className="auth-form" onSubmit={submit}>
            <div className="auth-form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handle} placeholder="Jane Doe" required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input name="city" value={form.city} onChange={handle} placeholder="New York" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required />
            </div>

            <div className="form-group">
              <label>Gender (optional)</label>
              <select name="gender" value={form.gender} onChange={handle}>
                <option value="">Prefer not to say</option>
                <option>Woman</option>
                <option>Man</option>
                <option>Non-binary</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Style Preferences (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {STYLE_PREFS.map(p => (
                  <button
                    key={p} type="button"
                    className={`filter-chip ${form.stylePrefs.includes(p) ? 'active' : ''}`}
                    onClick={() => togglePref(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
