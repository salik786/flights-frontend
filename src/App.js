// src/App.js
import React, { useState } from 'react';
import { useFlightData } from './context/FlightContext';
import Navbar from './components/Navbar';
import Filters from './components/Filters';
import LoadingIndicator from './components/LoadingIndicator';
import Heatmap from './Dashboard/domheatmap';
import CruiseDashboard from './Dashboard/CruiseDashboard';
import './App.css';
import ChartToggle from './Dashboard/ChartToggle';

const App = () => {
  const [activeTab, setActiveTab] = useState('flights');

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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content-container">
        {/* Flight Dashboard */}
        {activeTab === 'flights' && (
          <div className="dashboard-wrapper">
            <div className="dashboard-header">
              <h2 className="dashboard-title">Flight Dashboard</h2>
              <button
                className="refresh-button"
                onClick={refreshData}
                disabled={loading}
              >
                <span className="refresh-icon">↻</span>
                Refresh Data
              </button>
            </div>

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

            {/* Display Flight Data */}
            {!loading && !error && flightData ? (
              <div className="dashboard-container">
                {/* Compact Flight Overview Row with useful metrics */}
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

                <ChartToggle
                  flightData={flightData}
                  selectedFlightType={selectedFlightType}
                />
              </div>
            ) : (
              !loading && !error && <p className="no-data-message">No data available for the selected filters.</p>
            )}
          </div>
        )}

        {/* Cruise Dashboard */}
        {activeTab === 'cruises' && (
          <CruiseDashboard />
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>Powered by <a href="#" rel="noopener noreferrer">Sydney Transport API</a> | <a href="#" rel="noopener noreferrer">Developed by Salik Saleem</a></p>
      </footer>
    </div>
  );
};

export default App;