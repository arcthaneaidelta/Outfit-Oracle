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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="auth-container">
        <header className="auth-header-top">
          <div className="top-icon">✦</div>
          <h1>Outfit<span>Oracle</span></h1>
          <p>Smart Outfits, Zero Guesswork</p>
        </header>

        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-subtext">
            Join thousands who dress smarter. Set up your profile in seconds.
          </p>

          <form className="auth-form-modern" onSubmit={submit}>
            {/* Name & City — side by side */}
            <div className="signup-row">
              <div className="form-field">
                <label>Full name</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input name="name" value={form.name} onChange={handle} placeholder="Jane Doe" required />
                </div>
              </div>
              <div className="form-field">
                <label>City</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <input name="city" value={form.city} onChange={handle} placeholder="New York" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-field">
              <label>Email address</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
              </div>
            </div>

            {/* Password */}
            <div className="form-field">
              <label>Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                  placeholder="Min 6 characters" required
                />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            {/* Gender Dropdown */}
            <div className="form-field">
              <label>Gender</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                </div>
                <select name="gender" value={form.gender} onChange={handle} className="select-styled">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="form-field">
              <label>Style preferences <span style={{ fontWeight: 400, color: '#999' }}>(optional)</span></label>
              <div className="signup-chips">
                {STYLE_PREFS.map(p => (
                  <button
                    key={p} type="button"
                    className={`signup-chip ${form.stylePrefs.includes(p) ? 'active' : ''}`}
                    onClick={() => togglePref(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-switch-card">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
