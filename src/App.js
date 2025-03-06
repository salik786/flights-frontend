// src/App.js
import React from 'react';
import Heatmap from './Dashboard/domheatmap';
import Filters from './components/Filters';
import LoadingIndicator from './components/LoadingIndicator';
import { useFlightData } from './context/FlightContext';
import './App.css';

const App = () => {
  const {
    flightData,
    loading,
    error,
    selectedDate,
    selectedFlightType,
    flightDirection,
    setSelectedDate,
    setSelectedFlightType,
    setFlightDirection,
    refreshData
  } = useFlightData();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sydney Airport Flight Dashboard</h1>
        <div className="header-right">
          <button
            className="refresh-button"
            onClick={refreshData}
            disabled={loading}
          >
            Refresh Data
          </button>
        </div>
      </header>

      <Filters
        selectedDate={selectedDate}
        selectedFlightType={selectedFlightType}
        flightDirection={flightDirection}
        onDateChange={setSelectedDate}
        onFlightTypeChange={setSelectedFlightType}
        onDirectionChange={setFlightDirection}
      />

      {/* Loading Indicator with Progress */}
      {loading && <LoadingIndicator />}

      {/* Error Message */}
      {!loading && error && (
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={refreshData} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {/* Display Data */}
      {!loading && !error && flightData ? (
        <div className="dashboard-container">
          {/* Compact Flight Overview Row with more useful metrics */}
          <div className="flight-overview-card">
            <div className="flight-meta-info">
              <div className="meta-item total">
                <div className="meta-icon">🛫</div>
                <div className="meta-content">
                  <h3>Total Flights</h3>
                  <p>{flightData.total_flights}</p>
                </div>
              </div>
              <div className="meta-item on-time">
                <div className="meta-icon">✓</div>
                <div className="meta-content">
                  <h3>On Time</h3>
                  <p>{flightData.flight_statuses?.on_time || 0}
                    <span> ({Math.round((flightData.flight_statuses?.on_time || 0) / flightData.total_flights * 100)}%)</span>
                  </p>
                </div>
              </div>
              <div className="meta-item delayed">
                <div className="meta-icon">⏱️</div>
                <div className="meta-content">
                  <h3>Delayed</h3>
                  <p>{flightData.flight_statuses?.delayed || 0}
                    <span> ({Math.round((flightData.flight_statuses?.delayed || 0) / flightData.total_flights * 100)}%)</span>
                  </p>
                </div>
              </div>
              {flightData.peak_hours && flightData.peak_hours.max_flights && (
                <div className="meta-item peak">
                  <div className="meta-icon">📊</div>
                  <div className="meta-content">
                    <h3>Peak Hour</h3>
                    <p>{flightData.peak_hours.max_flights.hour} <span>({flightData.peak_hours.max_flights.count})</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Heatmap
            flightData={flightData}
            selectedFlightType={selectedFlightType}
          />
        </div>
      ) : (
        !loading && !error && <p className="no-data-message">No data available for the selected filters.</p>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>Powered by <a href="#" rel="noopener noreferrer">Sydney Airport API</a> | <a href="#" rel="noopener noreferrer">Developed by -</a></p>
      </footer>
    </div>
  );
};

export default App;