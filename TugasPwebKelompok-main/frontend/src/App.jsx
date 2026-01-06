import { useState } from 'react';
import './index.css';
import HomePage from './pages/HomePage';
import ScheduleResultsPage from './pages/ScheduleResultsPage';
import BookingModal from './components/BookingModal';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const handleSearch = (params) => {
    setSearchParams(params);
    setCurrentPage('results');
  };

  const handleSelectTrain = (data) => {
    setSelectedTrain(data);
  };

  const handleCloseModal = () => {
    setSelectedTrain(null);
  };

  const handleBookingConfirm = (bookingData) => {
    setSelectedTrain(null);
    setBookingSuccess(bookingData);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSearchParams(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={handleBackToHome} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">🚆</span>
            <span>E-Transport</span>
          </div>
          <nav style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <button className="btn btn-outline">
              My Bookings
            </button>
          </nav>
        </div>
      </header>

      {/* Success Toast */}
      {bookingSuccess && (
        <div style={{
          position: 'fixed',
          top: 'var(--space-20, 5rem)',
          right: 'var(--space-4)',
          background: 'rgba(16, 185, 129, 0.9)', /* var(--success) with opacity */
          color: 'white',
          padding: 'var(--space-4) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          zIndex: 1001,
          animation: 'slideUp 0.3s ease',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>✓ Booking Confirmed!</div>
          <div style={{ fontSize: '0.875rem' }}>
            {bookingSuccess.train.name} - {bookingSuccess.selectedClass.className}
          </div>
        </div>
      )}

      {/* Pages */}
      {currentPage === 'home' && (
        <HomePage onSearch={handleSearch} />
      )}

      {currentPage === 'results' && (
        <ScheduleResultsPage
          searchParams={searchParams}
          onBack={handleBackToHome}
          onSelectTrain={handleSelectTrain}
        />
      )}

      {/* Booking Modal */}
      {selectedTrain && (
        <BookingModal
          data={selectedTrain}
          passengers={searchParams?.passengers || 1}
          onClose={handleCloseModal}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}

export default App;
