import React, { useContext, useState, useCallback } from 'react';
import { DbContext } from './context/DbContext';

// Layout & Shared Components
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastContainer from './components/ToastContainer';

// Modals
import ApplyModal from './components/Modals/ApplyModal';
import AddStallModal from './components/Modals/AddStallModal';
import MaintenanceModal from './components/Modals/MaintenanceModal';
import AnnouncementModal from './components/Modals/AnnouncementModal';

// Views — Pre-auth
import Landing from './views/Landing';
import Auth from './views/Auth';

// Views — Main App
import Dashboard from './views/Dashboard';
import StallsMap from './views/StallsMap';
import ArNavigation from './views/ArNavigation';
import View360 from './views/View360';
import MyStall from './views/MyStall';
import Applications from './views/Applications';
import Payments from './views/Payments';
import Maintenance from './views/Maintenance';
import Announcements from './views/Announcements';
import ManageStalls from './views/ManageStalls';
import Profile from './views/Profile';
import Support from './views/Support';

function App() {
  const { currentUser } = useContext(DbContext);

  // Pre-auth screen: 'landing' | 'auth'
  const [screen, setScreen] = useState('landing');
  const [authTab, setAuthTab] = useState('login');

  // Current page within the main app
  const [currentPage, setCurrentPage] = useState('dashboard');

  // ─── Toast System ───────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Modal State ────────────────────────────────────────────────────────────
  const [applyModal, setApplyModal] = useState({ open: false, stallId: null });
  const [addStallModal, setAddStallModal] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [announcementModal, setAnnouncementModal] = useState(false);

  /**
   * onOpenModal(type, extra?)
   *   type: 'apply' | 'add-stall' | 'maintenance' | 'announcement'
   *   extra: stallId string (only for 'apply')
   */
  const onOpenModal = useCallback((type, extra) => {
    if (type === 'apply')        setApplyModal({ open: true, stallId: extra });
    if (type === 'add-stall')    setAddStallModal(true);
    if (type === 'maintenance')  setMaintenanceModal(true);
    if (type === 'announcement') setAnnouncementModal(true);
  }, []);

  // ─── Navigation helpers ─────────────────────────────────────────────────────
  const handleShowAuth = useCallback((tab = 'login') => {
    setAuthTab(tab);
    setScreen('auth');
  }, []);

  const handleBackToLanding = useCallback(() => {
    setScreen('landing');
  }, []);

  // ─── Page Renderer ──────────────────────────────────────────────────────────
  const renderPage = () => {
    const commonProps = { setCurrentPage, showToast };
    const withModal   = { ...commonProps, onOpenModal };

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...withModal} />;
      case 'stalls':
        return (
          <StallsMap
            {...commonProps}
            onOpenApplyModal={(id) => onOpenModal('apply', id)}
          />
        );
      case 'ar':
        return <ArNavigation {...commonProps} />;
      case 'view360':
        return <View360 {...commonProps} />;
      case 'mystall':
        return <MyStall {...withModal} />;
      case 'applications':
        return <Applications {...commonProps} />;
      case 'payments':
        return <Payments {...commonProps} />;
      case 'maintenance':
        return <Maintenance {...withModal} />;
      case 'announcements':
        return <Announcements {...withModal} />;
      case 'manage-stalls':
        return <ManageStalls {...withModal} />;
      case 'profile':
        return <Profile {...commonProps} />;
      case 'support':
        return <Support {...commonProps} />;
      default:
        return <Dashboard {...withModal} />;
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Loader (auto-hides after 1.6s) ── */}
      <Loader />

      {/* ── Global Toasts ── */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* ── Modals (always mounted, conditionally visible) ── */}
      <ApplyModal
        stallId={applyModal.stallId}
        isOpen={applyModal.open}
        onClose={() => setApplyModal({ open: false, stallId: null })}
        showToast={showToast}
      />
      <AddStallModal
        isOpen={addStallModal}
        onClose={() => setAddStallModal(false)}
        showToast={showToast}
      />
      <MaintenanceModal
        isOpen={maintenanceModal}
        onClose={() => setMaintenanceModal(false)}
        showToast={showToast}
      />
      <AnnouncementModal
        isOpen={announcementModal}
        onClose={() => setAnnouncementModal(false)}
        showToast={showToast}
      />

      {/* ── Screen Router ── */}
      {currentUser ? (
        // ======== MAIN APP ========
        <div id="app" className="app-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <div className="main-content">
            <Topbar currentPage={currentPage} />
            {renderPage()}
          </div>
        </div>
      ) : screen === 'auth' ? (
        // ======== AUTH SCREEN ========
        <Auth
          initialTab={authTab}
          onBackToLanding={handleBackToLanding}
          showToast={showToast}
        />
      ) : (
        // ======== LANDING SCREEN ========
        <Landing onNavigateToAuth={handleShowAuth} />
      )}
    </>
  );
}

export default App;
