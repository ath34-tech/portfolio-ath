import React, { useState, useEffect } from 'react';
import EditorialHeader from './components/editorial/EditorialHeader';
import NewsTicker from './components/editorial/NewsTicker';
import Footer from './components/editorial/Footer';
import CustomCursor from './components/editorial/CustomCursor';
import ScrollIndicator from './components/editorial/ScrollIndicator';

import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/tokens.css';
import './styles/typography.css';
import './styles/globals.css';

export default function App() {
  // Helper to get route path from window location hash or pathname
  const getRouteFromHash = () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash || hash === '') return '/';
    return hash;
  };

  const [currentRoute, setCurrentRoute] = useState(getRouteFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      const route = getRouteFromHash();
      setCurrentRoute(route);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path) => {
    window.location.hash = path;
    setCurrentRoute(path);
    window.scrollTo(0, 0);
  };

  // Route Resolver
  const renderCurrentPage = () => {
    if (currentRoute === '/' || currentRoute === '') {
      return <HomePage navigateTo={navigateTo} />;
    }
    if (currentRoute === '/work') {
      return <WorkPage navigateTo={navigateTo} />;
    }
    if (currentRoute.startsWith('/work/')) {
      const projectId = currentRoute.replace('/work/', '');
      return <ProjectDetailPage projectId={projectId} navigateTo={navigateTo} />;
    }
    if (currentRoute === '/about') {
      return <AboutPage navigateTo={navigateTo} />;
    }
    return <NotFoundPage navigateTo={navigateTo} />;
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--paper)', position: 'relative' }}>
      <CustomCursor />
      <EditorialHeader currentRoute={currentRoute} navigateTo={navigateTo} />
      <NewsTicker />
      
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      <ScrollIndicator />
      <Footer navigateTo={navigateTo} />
    </div>
  );
}
