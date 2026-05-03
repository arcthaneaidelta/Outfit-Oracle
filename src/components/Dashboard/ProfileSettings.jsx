import { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useToast } from '../shared/ToastContext';

export default function ProfileSettings() {
  const { user, userProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return addToast('New passwords do not match', 'error');
    }
    setLoading(true);
    // Mocking password change for demo - actual Firebase logic would go here
    setTimeout(() => {
      addToast('Password updated successfully', 'success');
      setPasswords({ current: '', new: '', confirm: '' });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="profile-settings-page">
      <div className="section-header">
        <h2 style={{ fontSize: '32px' }}>Profile Settings</h2>
        <p style={{ color: 'var(--charcoal-muted)' }}>Manage your account information and security</p>
      </div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px' }}>
        {/* Personal Info */}
        <div className="card">
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>👤</span> Personal Information
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="info-group">
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--charcoal-muted)', textTransform: 'uppercase' }}>Full Name</label>
              <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{userProfile?.name || 'Not set'}</div>
            </div>

            <div className="info-group">
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--charcoal-muted)', textTransform: 'uppercase' }}>Email Address</label>
              <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{user?.email}</div>
            </div>

            <div className="info-group">
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--charcoal-muted)', textTransform: 'uppercase' }}>Home City</label>
              <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{userProfile?.city || 'Not set'}</div>
            </div>

            <div className="info-group">
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--charcoal-muted)', textTransform: 'uppercase' }}>Gender</label>
              <div style={{ fontSize: '16px', fontWeight: 500, marginTop: '4px' }}>{userProfile?.gender || 'Prefer not to say'}</div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🔒</span> Security
          </h3>
          
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Current Password</label>
              <input 
                type="password" 
                className="form-control"
                value={passwords.current}
                onChange={e => setPasswords({...passwords, current: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>New Password</label>
              <input 
                type="password" 
                className="form-control"
                value={passwords.new}
                onChange={e => setPasswords({...passwords, new: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Confirm New Password</label>
              <input 
                type="password" 
                className="form-control"
                value={passwords.confirm}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '12px', width: 'fit-content' }} disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
