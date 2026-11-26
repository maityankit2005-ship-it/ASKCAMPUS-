import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  History,
  BookOpen,
  User,
  BarChart3,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  FolderKanban,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ title, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);

  const isAdmin = user?.role === 'admin';

  const navItems = isAdmin
    ? [
        { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/admin/faqs', label: 'Manage FAQs', icon: BookOpen },
        { to: '/admin/categories', label: 'Categories', icon: FolderKanban },
        { to: '/admin/questions', label: 'Student Questions', icon: HelpCircle },
        { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
      ]
    : [
        { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/student/chat', label: 'Ask AI', icon: MessageSquare },
        { to: '/student/history', label: 'Chat History', icon: History },
        { to: '/student/faqs', label: 'Browse FAQs', icon: BookOpen },
        { to: '/profile', label: 'My Profile', icon: User },
      ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleTopSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (isAdmin) {
      navigate(`/admin/faqs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/student/faqs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-mark" style={{ width: '34px', height: '34px' }}>
            <Sparkles size={18} />
          </div>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            AskCampus
          </span>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#A6A7BD',
                cursor: 'pointer',
              }}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '12px',
          }}
        >
          <button onClick={handleLogout} className="sidebar-link">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 700 }}>{title}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <form onSubmit={handleTopSearch} className="topbar-search">
              <Search size={16} color="var(--text-secondary)" />
              <input
                type="text"
                placeholder={isAdmin ? 'Search FAQs...' : 'Search campus FAQs...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setShowNotif((prev) => !prev)}
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>

              {showNotif && (
                <div
                  className="card fade-in"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '280px',
                    padding: '14px',
                    zIndex: 40,
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '13.5px',
                      marginBottom: '6px',
                    }}
                  >
                    System Status
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {isAdmin
                      ? 'FAQ knowledge base and MongoDB analytics are live.'
                      : 'AskCampus AI Assistant is online and ready to answer your questions.'}
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px',
                borderRadius: '10px',
              }}
              title="View Profile"
            >
              <div className="avatar-circle">{initials}</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1.25,
                }}
              >
                <span style={{ fontSize: '13.5px', fontWeight: 600 }}>
                  {user?.name}
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-secondary)',
                    textTransform: 'capitalize',
                  }}
                >
                  {user?.role}
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="page-content fade-in">{children}</main>
      </div>
    </div>
  );
}
