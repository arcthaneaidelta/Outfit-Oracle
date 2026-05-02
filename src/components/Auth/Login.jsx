import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '../shared/ToastContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

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
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">Outfit<span>Oracle</span></div>
          <p className="auth-tagline">
            Your personal AI stylist. Curate, plan, and wear with intention — every single day.
          </p>
          <div className="auth-features">
            {[
              ['🌤️', 'Weather-aware outfit suggestions'],
              ['👗', 'Smart wardrobe management'],
              ['📅', 'Weekly outfit planning'],
              ['✨', 'AI-powered recommendations'],
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
          <h2>Welcome back</h2>
          <p>Sign in to your OutfitOracle account</p>

          <form className="auth-form" onSubmit={submit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handle}
                placeholder="you@example.com" required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handle}
                placeholder="••••••••" required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
