import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../shared/ToastContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      addToast('Welcome back!', 'success');
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
          <h2>Welcome back</h2>
          <p className="auth-subtext">
            Sign in to access your wardrobe, get outfit ideas, and plan your looks with confidence.
          </p>

          <form className="auth-form-modern" onSubmit={submit}>
            <div className="form-field">
              <label>Email address</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  type="email" name="email" value={form.email} onChange={handle}
                  placeholder="you@example.com" required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handle}
                  placeholder="••••••••" required
                />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <button type="submit" className="btn-signin" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider-modern">
            <span>or</span>
          </div>

          <div className="social-buttons">
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.25h2.91c1.7-1.56 2.68-3.86 2.68-6.6z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.25c-.8.54-1.83.86-3.05.86-2.34 0-4.32-1.58-5.03-3.71H1.04v2.33C2.52 16.03 5.56 18 9 18z" fill="#34A853"/><path d="M3.97 10.72c-.18-.54-.28-1.11-.28-1.72s.1-1.18.28-1.72V4.95H1.04C.38 6.27 0 7.59 0 9s.38 2.73 1.04 4.05l2.93-2.33z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.51.45 3.44 1.34l2.58-2.58C13.47.89 11.43 0 9 0 5.56 0 2.52 1.97 1.04 4.95l2.93 2.33c.71-2.13 2.69-3.71 5.03-3.71z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M15.5 8.1c-.1-2.4-1.6-4.3-3.8-4.3-1.2 0-2.2.6-2.8 1.1-.6-.6-1.6-1.1-2.8-1.1-2.2 0-3.7 1.9-3.8 4.3 0 1.2.3 2.4 1 3.4 1.4 1.9 4.3 5.1 5.6 5.6.2.1.4.1.6 0 1.3-.5 4.2-3.7 5.6-5.6.7-1 1-2.2 1-3.4z"/></svg>
              Continue with Apple
            </button>
          </div>

          <div className="secure-info">
            <div className="secure-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="secure-text">
              <h4>Secure sign in</h4>
              <p>Your data is encrypted and always protected.</p>
            </div>
          </div>

          <footer className="auth-card-footer">
            <div className="footer-faces">
              <div className="face" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)' }}></div>
              <div className="face" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/men/32.jpg)' }}></div>
              <div className="face" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/women/68.jpg)' }}></div>
              <div className="face" style={{ backgroundImage: 'url(https://randomuser.me/api/portraits/men/45.jpg)' }}></div>
            </div>
            <div className="footer-text">
              <p>Wardrobe planning for every style.</p>
              <span>Your style. Your way.</span>
            </div>
          </footer>

          <div className="auth-switch-card">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}

