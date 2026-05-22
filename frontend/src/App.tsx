import React, { useState } from 'react';
import { AuthProvider, useAuth } from './store/authContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage, CareersPage, PrivacyPage, TermsPage } from './pages/CompanyPages';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { ArticleCard } from './components/ArticleCard';
import { PreferencesDrawer } from './components/PreferencesDrawer';
import { useNews } from './hooks/useNews';
import { useBookmarks } from './hooks/useBookmarks';
import { DevModeToggle } from './components/DevModeToggle';

const MainAppContent: React.FC = () => {
    const { user, loading: authLoading, logout, toggleTheme, preferences } = useAuth();
    const [activeView, setActiveView] = useState<'news' | 'bookmarks' | 'login' | 'register' | 'more_news' | 'about' | 'careers' | 'privacy' | 'terms'>('news');
    const [isPrefsOpen, setIsPrefsOpen] = useState<boolean>(false);
    const [moreNewsPage, setMoreNewsPage] = useState<number>(0);
    const [shuffledArticles, setShuffledArticles] = useState<any[]>([]);

    React.useEffect(() => {
        if (user && (activeView === 'login' || activeView === 'register')) {
            setActiveView('news');
        }
    }, [user, activeView]);

    // 1. Initialize our caching news loader and persistent bookmarks sync hooks
    const { 
        articles, 
        category, 
        loading: newsLoading, 
        setCategory, 
        setSearchQuery,
        refresh
    } = useNews('general');

    const { 
        bookmarks, 
        loading: bookmarksLoading, 
        addBookmark, 
        removeBookmark, 
        isBookmarked, 
        getBookmarkedId 
    } = useBookmarks();

    // Randomize articles whenever they are newly fetched from the API
    React.useEffect(() => {
        if (articles.length > 0) {
            setShuffledArticles([...articles].sort(() => Math.random() - 0.5));
        } else {
            setShuffledArticles([]);
        }
    }, [articles]);

    // 2. Display spinner during initial user auth load
    if (authLoading) {
        return (
            <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'hsl(var(--background))' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid hsl(var(--border))', borderTopColor: 'hsl(var(--primary))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Removed global unauthenticated block

    /**
     * Intercepts bookmark star clicks to dynamically add or delete persistent records in PostgreSQL
     */
    const handleBookmarkToggle = async (article: any) => {
        if (!user) {
            setActiveView('login');
            return;
        }
        const bookmarkedId = getBookmarkedId(article.url);
        if (bookmarkedId) {
            await removeBookmark(bookmarkedId);
        } else {
            await addBookmark(article);
        }
    };

    const isLoading = newsLoading || bookmarksLoading;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header Navigation Bar */}
            <header 
                style={{ 
                    position: 'fixed', 
                    top: activeView === 'login' || activeView === 'register' ? '0' : '16px', 
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: activeView === 'login' || activeView === 'register' ? '100%' : 'calc(100% - 48px)',
                    maxWidth: activeView === 'login' || activeView === 'register' ? 'none' : '1200px',
                    zIndex: 50, 
                    borderRadius: activeView === 'login' || activeView === 'register' ? '0' : '50px', 
                    border: activeView === 'login' || activeView === 'register' ? 'none' : '1px solid hsl(var(--border) / 0.4)',
                    padding: '12px 24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    backgroundColor: activeView === 'login' || activeView === 'register' ? 'transparent' : 'hsl(var(--card) / 0.65)',
                    backdropFilter: activeView === 'login' || activeView === 'register' ? 'none' : 'blur(16px)',
                    WebkitBackdropFilter: activeView === 'login' || activeView === 'register' ? 'none' : 'blur(16px)',
                    boxShadow: activeView === 'login' || activeView === 'register' ? 'none' : '0 8px 32px -8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease'
                }}
            >
                <div 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: activeView === 'login' || activeView === 'register' ? '#fff' : undefined }} 
                    onClick={() => {
                        setActiveView('news');
                        setCategory('general');
                        setSearchQuery('');
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: activeView === 'login' || activeView === 'register' ? '#fff' : 'hsl(var(--primary))' }}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    <h2 style={{ 
                        fontSize: '1.4rem', 
                        fontWeight: 800, 
                        fontFamily: 'var(--font-heading)', 
                        letterSpacing: '-0.02em',
                        background: activeView === 'login' || activeView === 'register' ? 'none' : 'linear-gradient(to right, hsl(var(--foreground)), hsl(var(--primary)))',
                        WebkitBackgroundClip: activeView === 'login' || activeView === 'register' ? 'none' : 'text',
                        WebkitTextFillColor: activeView === 'login' || activeView === 'register' ? 'inherit' : 'transparent',
                    }}>
                        e-akhbar
                    </h2>
                </div>

                {/* Navigation Items */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button className="icon-btn" onClick={refresh} title="Refresh Feed">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 2.13-5.88L21 8"/></svg>
                    </button>
                    <button className={`icon-btn ${activeView === 'news' || activeView === 'more_news' ? 'active' : ''}`} onClick={() => setActiveView('news')} title="Discover News">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>
                    </button>
                    <button className="icon-btn" onClick={toggleTheme} title={preferences?.theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}>
                        {preferences?.theme === 'light' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                        )}
                    </button>
                    {user ? (
                        <button className="icon-btn" style={{ color: 'hsl(var(--danger))' }} onClick={logout} title="Logout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        </button>
                    ) : (
                        <button className="icon-btn" style={{ color: 'hsl(var(--primary))' }} onClick={() => setActiveView('login')} title="Login">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content Dashboard */}
            <main style={{ flex: 1, width: '100%', maxWidth: (activeView === 'login' || activeView === 'register') ? '100%' : '1200px', margin: '0 auto', padding: (activeView === 'login' || activeView === 'register') ? '0px' : '120px 24px 40px 24px' }}>
                
                {/* Visual Section Greeting Banner */}
                {activeView !== 'login' && activeView !== 'register' && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
                                {activeView === 'news' ? 'Custom News Feed' : activeView === 'more_news' ? 'All Live Articles' : activeView === 'bookmarks' ? 'Your Bookmarks' : ''}
                            </h1>
                            <p style={{ color: 'hsl(var(--muted))' }}>
                                {activeView === 'news' || activeView === 'more_news'
                                    ? (user ? `Welcome, ${user.username}! Explore breaking stories or customize interests in settings.` : 'Explore breaking stories and the latest updates.') 
                                    : activeView === 'bookmarks' ? 'Persistently cached summaries saved on your profile.'
                                    : ''
                                }
                            </p>
                        </div>

                        {/* Show Search bar only in the active discovery news feed */}
                        {(activeView === 'news' || activeView === 'more_news') && <SearchBar onSearch={setSearchQuery} />}
                    </div>
                )}

                {/* Sub-Filters Badge Grid */}
                {(activeView === 'news' || activeView === 'more_news') && (
                    <CategoryFilter 
                        currentCategory={category} 
                        onSelectCategory={(newCat: string) => {
                            setCategory(newCat);
                            setActiveView('news');
                            setMoreNewsPage(0);
                        }} 
                    />
                )}

                {/* Active grid display */}
                {activeView === 'login' ? (
                    <LoginPage onSwitchToRegister={() => setActiveView('register')} />
                ) : activeView === 'register' ? (
                    <RegisterPage onSwitchToLogin={() => setActiveView('login')} />
                ) : isLoading ? (
                    // Beautiful loading skeleton loader grid
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="glass-panel" style={{ height: '380px', display: 'flex', flexDirection: 'column', padding: '24px', gap: '16px', animation: 'pulse 1.5s infinite ease-in-out' }}>
                                <div style={{ height: '180px', borderRadius: 'var(--radius-md)', backgroundColor: 'hsl(var(--border) / 0.4)' }}></div>
                                <div style={{ height: '24px', width: '60%', borderRadius: '4px', backgroundColor: 'hsl(var(--border) / 0.4)' }}></div>
                                <div style={{ height: '40px', width: '100%', borderRadius: '4px', backgroundColor: 'hsl(var(--border) / 0.4)' }}></div>
                            </div>
                        ))}
                        <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.3; } }`}</style>
                    </div>
                ) : activeView === 'news' ? (
                    // Discover Feeds Grid
                    shuffledArticles.length > 0 ? (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                                {shuffledArticles.slice(0, 12).map((art) => (
                                    <ArticleCard
                                        key={art.url}
                                        article={art}
                                        isBookmarked={isBookmarked(art.url)}
                                        onToggleBookmark={() => handleBookmarkToggle(art)}
                                    />
                                ))}
                            </div>
                            {shuffledArticles.length > 12 && (
                                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                    <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', borderRadius: '30px' }} onClick={() => setActiveView('more_news')}>
                                        See More Articles ↓
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', color: 'hsl(var(--muted))' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📭</div>
                            <h3>No articles matched your criteria</h3>
                            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Try switching categories or clearing search keywords.</p>
                        </div>
                    )
                ) : activeView === 'more_news' ? (
                    // All articles grid
                    <>
                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => {
                                setActiveView('news');
                                setMoreNewsPage(0);
                            }}>
                                ← Back to Top Headlines
                            </button>
                            {shuffledArticles.length > 50 && (
                                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => {
                                    if (moreNewsPage === 0) {
                                        setMoreNewsPage(1);
                                    } else {
                                        // Once they have seen all 100, reshuffle and start over at page 0
                                        setShuffledArticles(prev => [...prev].sort(() => Math.random() - 0.5));
                                        setMoreNewsPage(0);
                                    }
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}>
                                    🔄 Refresh Feed
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                            {shuffledArticles.slice(moreNewsPage * 50, (moreNewsPage + 1) * 50).map((art) => (
                                <ArticleCard
                                    key={art.url}
                                    article={art}
                                    isBookmarked={isBookmarked(art.url)}
                                    onToggleBookmark={() => handleBookmarkToggle(art)}
                                />
                            ))}
                        </div>

                    </>
                ) : activeView === 'bookmarks' ? (
                    // Bookmarks Saved Feed Grid
                    bookmarks.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                            {bookmarks.map((b) => (
                                <ArticleCard
                                    key={b.bookmarkId}
                                    article={b.article}
                                    isBookmarked={true}
                                    onToggleBookmark={() => removeBookmark(b.article.articleId!)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', color: 'hsl(var(--muted))' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>⭐️</div>
                            <h3>No saved articles yet</h3>
                            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Explore live feeds and click the star ribbons to save articles.</p>
                        </div>
                    )
                ) : null}
                
                {/* Company Pages */}
                {activeView === 'about' && <AboutPage />}
                {activeView === 'careers' && <CareersPage />}
                {activeView === 'privacy' && <PrivacyPage />}
                {activeView === 'terms' && <TermsPage />}
            </main>

            {/* Custom Account Settings Slider Drawer */}
            <PreferencesDrawer isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />

            {/* Footer */}
            <footer className="glass-panel" style={{ marginTop: 'auto', padding: '60px 40px 24px', borderTop: '1px solid hsl(var(--border) / 0.2)', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, backgroundColor: 'hsl(var(--card) / 0.3)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
                        {/* Branding */}
                        <div style={{ flex: '1 1 300px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'hsl(var(--primary))', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><circle cx="12" cy="12" r="10"/></svg>
                                e-akhbar
                            </div>
                            <p style={{ color: 'hsl(var(--muted))', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '300px' }}>
                                Next-generation intelligence platform bringing you the most relevant, interest-based news hubs globally.
                            </p>
                        </div>
                        
                        {/* Quick Links */}
                        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
                            <div>
                                <h4 style={{ color: 'hsl(var(--foreground))', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 600 }}>Hubs</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {['Technology', 'Business', 'Politics', 'Science'].map(item => (
                                        <li key={item}><a href="#" style={{ color: 'hsl(var(--muted))', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'} onMouseOut={e => e.currentTarget.style.color = 'hsl(var(--muted))'}>{item}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: 'hsl(var(--foreground))', marginBottom: '16px', fontSize: '0.95rem', fontWeight: 600 }}>Company</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { name: 'About Us', view: 'about' as const },
                                        { name: 'Careers', view: 'careers' as const },
                                        { name: 'Privacy Policy', view: 'privacy' as const },
                                        { name: 'Terms of Service', view: 'terms' as const }
                                    ].map(item => (
                                        <li key={item.name}>
                                            <a href="#" 
                                               onClick={(e) => { e.preventDefault(); setActiveView(item.view); window.scrollTo(0,0); }} 
                                               style={{ color: 'hsl(var(--muted))', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }} 
                                               onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'} 
                                               onMouseOut={e => e.currentTarget.style.color = 'hsl(var(--muted))'}>
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid hsl(var(--border) / 0.2)', paddingTop: '24px', color: 'hsl(var(--muted))', fontSize: '0.85rem' }}>
                        <div>&copy; {new Date().getFullYear()} e-akhbar Portal. All rights reserved.</div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <a href="#" style={{ color: 'hsl(var(--muted))', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'} onMouseOut={e => e.currentTarget.style.color = 'hsl(var(--muted))'}>Twitter</a>
                            <a href="#" style={{ color: 'hsl(var(--muted))', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'} onMouseOut={e => e.currentTarget.style.color = 'hsl(var(--muted))'}>LinkedIn</a>
                            <a href="#" style={{ color: 'hsl(var(--muted))', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'hsl(var(--primary))'} onMouseOut={e => e.currentTarget.style.color = 'hsl(var(--muted))'}>GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <MainAppContent />
            <DevModeToggle />
        </AuthProvider>
    );
};

export default App;

