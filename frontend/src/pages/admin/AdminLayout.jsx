import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../../components/NotificationBell';

const LogOutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const FinanceIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const AnalyticsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);

const AnnouncementIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z" />
        <path d="M22 12h-4" />
        <path d="M14 12h-4" />
        <path d="M18 16h-4" />
        <path d="M18 8h-4" />
    </svg>
);

const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

const NAV = [
    { label: 'User Management', icon: <UsersIcon />, path: '/admin/users' },
    { label: 'Broadcast Emails', icon: <MailIcon />, path: '/admin/broadcast' },
    { label: 'Finance Overview', icon: <FinanceIcon />, path: '/admin/finance' },
    { label: 'Reports & Analytics', icon: <AnalyticsIcon />, path: '/admin/reports' },
    { label: 'Special Announcements', icon: <AnnouncementIcon />, path: '/admin/notices' },
];

export default function AdminLayout({ children, title }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout theme-workspace-light">
            {/* Sidebar */}
            <aside className="sidebar">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="sidebar-logo">
                        <div style={{ 
                            width: '40px', height: '40px', borderRadius: '12px', 
                            background: '#CFF971', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', color: '#0F2819' 
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>CareLink</div>
                            <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>Admin Console</div>
                        </div>
                    </div>
                </Link>

                <nav className="sidebar-nav">
                    <div className="section-title">Platform</div>
                    {NAV.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-nav" style={{ flex: 'none', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                        <LogOutIcon /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="main-content" style={{ minWidth: 0 }}>
                <header className="topbar">
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {title}
                        </h1>
                        <div style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <NotificationBell light />
                        <div 
                            style={{ 
                                width: '40px', height: '40px', borderRadius: '50%', 
                                background: 'rgba(207, 249, 113, 0.1)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: '#0F2819', fontSize: '1.2rem', fontWeight: 800,
                                overflow: 'hidden', border: '1.5px solid rgba(15, 40, 25, 0.2)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                cursor: 'default'
                            }}
                        >
                            {user?.profilePicturePath ? (
                                <img 
                                    src={`/api/v1/uploads/profile-picture/${user.profilePicturePath}`} 
                                    alt="Profile" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            ) : (
                                "A"
                            )}
                        </div>
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
