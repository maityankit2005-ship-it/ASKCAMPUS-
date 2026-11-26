import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout title="My Profile">
      <div className="card" style={{ maxWidth: '540px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            className="avatar-circle"
            style={{ width: '58px', height: '58px', fontSize: '20px', borderRadius: '14px' }}
          >
            {initials}
          </div>
          <div>
            <h2 style={{ fontSize: '20px' }}>{user?.name}</h2>
            <span className="badge" style={{ textTransform: 'capitalize', marginTop: '4px' }}>
              {user?.role} Account
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '18px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            marginBottom: '22px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={18} color="var(--primary-purple)" />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Full Name
              </div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={18} color="var(--primary-purple)" />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Email Address
              </div>
              <div style={{ fontWeight: 600 }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={18} color="var(--primary-purple)" />
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Role
              </div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-danger">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </DashboardLayout>
  );
}
