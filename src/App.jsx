import { useContext, useState, useCallback } from 'react';
import { DbContext } from './context/DbContext';

// Layout & Shared Components
import Loader from './components/Loader';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ToastContainer from './components/ToastContainer';

// Modals
import StallDetailModal from './components/Modals/StallDetailModal';
import ConfirmModal from './components/Modals/ConfirmModal';

// Views — Pre-auth
import Landing from './views/Landing';
import Login from './views/Login';
import Register from './views/Register';

// Views — Renter
import RenterDashboard from './views/renter/Dashboard';
import View360 from './views/renter/View360';
import ArNavigation from './views/renter/ArNavigation';
import StallDirectory from './views/renter/StallDirectory';
import StallDetail from './views/renter/StallDetail';
import InquiryForm from './views/renter/InquiryForm';
import Applications from './views/renter/Applications';
import RenterProfile from './views/renter/Profile';

// Views — Contractor
import ContractorDashboard from './views/contractor/Dashboard';
import StallManagement from './views/contractor/StallManagement';
import FloorPlan from './views/contractor/FloorPlan';
import RentalApplications from './views/contractor/RentalApplications';
import RenterRecords from './views/contractor/RenterRecords';
import ContractorProfile from './views/contractor/Profile';

function App() {
  const { currentUser } = useContext(DbContext);

  // Pre-auth screens: 'landing' | 'login' | 'register'
  const [screen, setScreen] = useState('landing');

  // Current page within the main app
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Selected stall for detail/inquiry
  const [selectedStall, setSelectedStall] = useState(null);

  // ─── Toast System ─────────────────────────────────────────────────────────
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

  // ─── Modal State ──────────────────────────────────────────────────────────
  const [stallDetailModal, setStallDetailModal] = useState({ open: false, stall: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, message: '', onConfirm: null });

  const onOpenModal = useCallback((type, extra) => {
    if (type === 'stall-detail') setStallDetailModal({ open: true, stall: extra });
    if (type === 'confirm')      setConfirmModal({ open: true, ...extra });
  }, []);

  // ─── Navigation Helpers ───────────────────────────────────────────────────
  const goToLogin    = useCallback(() => setScreen('login'), []);
  const goToRegister = useCallback(() => setScreen('register'), []);
  const goToLanding  = useCallback(() => setScreen('landing'), []);

  // ─── Page Renderer ────────────────────────────────────────────────────────
  const renderPage = () => {
    const commonProps = { setCurrentPage, showToast };
    const withModal   = { ...commonProps, onOpenModal };

    // Contractor pages
    if (currentUser?.role === 'contractor') {
      switch (currentPage) {
        case 'dashboard':      return <ContractorDashboard {...withModal} />;
        case 'stall-mgmt':     return <StallManagement {...withModal} />;
        case 'floor-plan':     return <FloorPlan {...commonProps} />;
        case 'applications':   return <RentalApplications {...withModal} />;
        case 'renter-records': return <RenterRecords {...commonProps} />;
        case 'profile':        return <ContractorProfile {...commonProps} />;
        default:               return <ContractorDashboard {...withModal} />;
      }
    }

    // Renter pages
    switch (currentPage) {
      case 'dashboard':
        return <RenterDashboard {...withModal} />;
      case 'view360':
        return <View360 {...commonProps} />;
      case 'ar-navigation':
        return <ArNavigation {...commonProps} />;
      case 'stall-directory':
        return (
          <StallDirectory
            {...commonProps}
            onViewStall={(stall) => {
              setSelectedStall(stall);
              setCurrentPage('stall-detail');
            }}
          />
        );
      case 'stall-detail':
        return (
          <StallDetail
            {...commonProps}
            stall={selectedStall}
            onSendInquiry={() => setCurrentPage('inquiry-form')}
          />
        );
      case 'inquiry-form':
        return <InquiryForm {...commonProps} stall={selectedStall} />;
      case 'applications':
        return <Applications {...commonProps} />;
      case 'profile':
        return <RenterProfile {...commonProps} />;
      default:
        return <RenterDashboard {...withModal} />;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Loader */}
      <Loader />

      {/* Global Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Modals */}
      <StallDetailModal
        isOpen={stallDetailModal.open}
        stall={stallDetailModal.stall}
        onClose={() => setStallDetailModal({ open: false, stall: null })}
        showToast={showToast}
      />
      <ConfirmModal
        isOpen={confirmModal.open}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ open: false, message: '', onConfirm: null })}
      />

      {/* Screen Router */}
      {currentUser ? (
        // ── MAIN APP ──
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Sidebar — desktop only */}
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            role={currentUser?.role}
          />

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar currentPage={currentPage} />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
              {renderPage()}
            </main>
          </div>

          {/* Bottom Nav — mobile only */}
          <BottomNav
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            role={currentUser?.role}
          />
        </div>
      ) : screen === 'login' ? (
        // ── LOGIN ──
        <Login
          onNavigateToRegister={goToRegister}
          onBackToLanding={goToLanding}
          showToast={showToast}
        />
      ) : screen === 'register' ? (
        // ── REGISTER ──
        <Register
          onNavigateToLogin={goToLogin}
          onBackToLanding={goToLanding}
          showToast={showToast}
        />
      ) : (
        // ── LANDING ──
        <Landing
          onNavigateToLogin={goToLogin}
          onNavigateToRegister={goToRegister}
        />
      )}
    </>
  );
}

export default App;