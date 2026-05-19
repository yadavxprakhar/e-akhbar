import React, { useState } from 'react';
import { AuthProvider, useAuth } from './store/authContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
const MainAppContent: React.FC = () => {
    const { user, loading, logout, toggleTheme, preferences } = useAuth();
    const [activeView, setActiveView] = useState<'news' | 'bookmarks'>('news');
    const [showLogin, setShowLogin] = useState<boolean>(true); // Toggles between Login and Register if unauthenticated

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(var(--background))' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid hsl(var(--border))', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // 1. Unauthenticated Gateway Views (Displays premium glassmorphism forms)
    if (!user) {
        return showLogin ? (
            <LoginPage onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
            <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />
        );
    }

    // 2. Authenticated Portal Layout Frame (Active News & Bookmarks Dashboard)
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))', display: 'flex', flexDirection: 'column' }}>
            {/* Header Navigation Bar */}
            <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 50, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setActiveView('news')}>
                    <span style={{ fontSize: '1.5rem' }}>📰</span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>NewsPortal</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className={`btn btn-secondary ${activeView === 'news' ? 'btn-primary' : ''}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setActiveView('news')}>
                        Discover Feed
                    </button>
                    <button className={`btn btn-secondary ${activeView === 'bookmarks' ? 'btn-primary' : ''}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setActiveView('bookmarks')}>
                        My Bookmarks
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={toggleTheme}>
                        {preferences?.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: 'hsl(var(--danger) / 0.4)', color: 'hsl(var(--danger))' }} onClick={logout}>
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Page Content Body */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>
                            {activeView === 'news' ? 'Live Caching Feeds' : 'Saved Bookmarks'}
                        </h1>
                        <p style={{ color: 'hsl(var(--muted))' }}>
                            {activeView === 'news' 
                                ? `Welcome back, ${user.username}! Explore breaking headlines customized to your preferred categories.` 
                                : 'Retrieve and read saved summaries persistently cached for you.'
                            }
                        </p>
                    </div>
                </div>

                {/* Dashboard grid placeholders - will be populated by modular sub-components */}
                <div className="glass-panel" style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Layout Scaffold Ready</h3>
                    <p style={{ color: 'hsl(var(--muted))', maxWidth: '400px', fontSize: '0.9rem', marginBottom: '24px' }}>
                        Your master React App context provider, security headers, HSL design overrides, and view routing frameworks are fully active.
                    </p>
                    <button className="btn btn-primary">Initialize visual dashboards</button>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'hsl(var(--muted))', borderTop: '1px solid hsl(var(--border) / 0.3)' }}>
                &copy; {new Date().getFullYear()} Modern News Portal. All rights reserved.
            </footer>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <MainAppContent />
        </AuthProvider>
    );
};

export default App;
