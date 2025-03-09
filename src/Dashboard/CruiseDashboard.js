// src/Dashboard/CruiseDashboard.js
import React, { useState, useEffect } from 'react';
import cruiseService from '../services/cruiseData';
import LoadingIndicator from '../components/LoadingIndicator';
import './CruiseDash.css';

const CruiseDashboard = () => {
    const [cruises, setCruises] = useState([]);
    const [filteredCruises, setFilteredCruises] = useState([]);
    const [terminalFilter, setTerminalFilter] = useState('all');
    const [selectedShip, setSelectedShip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonth] = useState(3); // March
    const [currentYear] = useState(2025);
    const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'

    // Fetch cruise data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get main terminal cruises (OPT and WBCT only)
                const mainTerminalCruises = await cruiseService.getMainTerminalCruises(currentMonth, currentYear);

                // Filter out past cruises
                const now = new Date();
                const currentCruises = mainTerminalCruises.filter(cruise => {
                    const cruiseDate = new Date(cruise.departureTime);
                    return cruiseDate >= now;
                });

                setCruises(currentCruises);
                setFilteredCruises(currentCruises);

                setLoading(false);
            } catch (err) {
                console.error('Error loading cruise data:', err);
                setError('Failed to load cruise data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentMonth, currentYear]);

    // Filter cruises when terminal filter changes
    useEffect(() => {
        if (!cruises || cruises.length === 0) return;

        if (terminalFilter === 'all') {
            setFilteredCruises(cruises);
        } else {
            setFilteredCruises(cruises.filter(cruise =>
                cruise.berthCode === terminalFilter));
        }
    }, [terminalFilter, cruises]);

    // Get color based on cruise line
    const getCruiseLineColor = (cruiseLine) => {
        const colorMap = {
            'CARNIVAL CRUISE LINE': '#e63946',
            'Carnival Plc': '#e63946',
            'PRINCESS CRUISE LINES LTD': '#457b9d',
            'ROYAL CARIBBEAN CRUISES LTD': '#1d3557',
            'Celebrity Cruises Inc': '#2a9d8f',
            'OCEANIA CRUISES LTD': '#f4a261',
            'Viking Ocean Cruises Ltd': '#bc6c25',
            'HOLLAND AMERICA LINE NV': '#283618',
            'Regent Seven Seas Cruises Inc': '#7209b7',
            'MSC Crociere SpA': '#3a86ff'
        };

        return colorMap[cruiseLine] || '#999999';
    };

    // Handle ship selection
    const handleShipSelect = (ship) => {
        setSelectedShip(selectedShip === ship ? null : ship);
    };

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get cruise statistics
    const getStats = () => {
        return {
            totalCruises: filteredCruises.length,
            byTerminal: {
                OPT: filteredCruises.filter(cruise => cruise.berthCode === 'OPT').length,
                WBCT: filteredCruises.filter(cruise => cruise.berthCode === 'WBCT').length
            },
            uniqueShips: [...new Set(filteredCruises.map(cruise => cruise.vesselName))].length
        };
    };

    const stats = getStats();

    if (loading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    if (filteredCruises.length === 0) {
        return (
            <div className="cruise-dashboard">
                <div className="cruise-header">
                    <h2 className="cruise-title">Sydney Cruise Ship Schedule</h2>

                    <div className="terminal-filter">
                        <button
                            className={`terminal-btn ${terminalFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setTerminalFilter('all')}
                        >
                            All Terminals
                        </button>
                        <button
                            className={`terminal-btn ${terminalFilter === 'OPT' ? 'active' : ''}`}
                            onClick={() => setTerminalFilter('OPT')}
                        >
                            Overseas Passenger Terminal
                        </button>
                        <button
                            className={`terminal-btn ${terminalFilter === 'WBCT' ? 'active' : ''}`}
                            onClick={() => setTerminalFilter('WBCT')}
                        >
                            White Bay Cruise Terminal
                        </button>
                    </div>
                </div>

                <div className="no-cruises-container">
                    <div className="no-cruises-message">
                        No upcoming cruises found for the selected terminal.
                    </div>
                </div>
            </div>
        );
    }

    // Sort cruises by arrival date
    const sortedCruises = [...filteredCruises].sort((a, b) => {
        return new Date(a.arrivalTime) - new Date(b.arrivalTime);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    return (
        <div className="cruise-dashboard">
            <div className="cruise-header">
                <h2 className="cruise-title">Sydney Cruise Ship Schedule</h2>

                <div className="terminal-filter">
                    <button
                        className={`terminal-btn ${terminalFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setTerminalFilter('all')}
                    >
                        All Terminals
                    </button>
                    <button
                        className={`terminal-btn ${terminalFilter === 'OPT' ? 'active' : ''}`}
                        onClick={() => setTerminalFilter('OPT')}
                    >
                        Overseas Passenger Terminal
                    </button>
                    <button
                        className={`terminal-btn ${terminalFilter === 'WBCT' ? 'active' : ''}`}
                        onClick={() => setTerminalFilter('WBCT')}
                    >
                        White Bay Cruise Terminal
                    </button>
                </div>
            </div>

            <div className="cruise-stats">
                <div className="stats-card">
                    <div className="stats-icon">🚢</div>
                    <div className="stats-content">
                        <h3>Total Cruises</h3>
                        <p>{stats.totalCruises}</p>
                    </div>
                </div>
                <div className="stats-card">
                    <div className="stats-icon">🏢</div>
                    <div className="stats-content">
                        <h3>OPT Terminal</h3>
                        <p>{stats.byTerminal.OPT}</p>
                    </div>
                </div>
                <div className="stats-card">
                    <div className="stats-icon">🏢</div>
                    <div className="stats-content">
                        <h3>White Bay Terminal</h3>
                        <p>{stats.byTerminal.WBCT}</p>
                    </div>
                </div>
                <div className="stats-card">
                    <div className="stats-icon">⚓</div>
                    <div className="stats-content">
                        <h3>Unique Ships</h3>
                        <p>{stats.uniqueShips}</p>
                    </div>
                </div>
            </div>

            <div className="cruise-timeline-container">
                <div className="timeline-header">
                    <h3>Upcoming Cruises</h3>
                    <div className="view-toggle">
                        <button
                            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            List View
                        </button>
                        <button
                            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            Grid View
                        </button>
                    </div>
                </div>

                {viewMode === 'list' ? (
                    <div className="cruise-timeline">
                        {sortedCruises.map((cruise, index) => {
                            const cruiseDate = new Date(cruise.arrivalTime);
                            cruiseDate.setHours(0, 0, 0, 0); // Reset time for date comparison

                            const isToday = cruiseDate.getTime() === today.getTime();

                            return (
                                <div
                                    key={`${cruise.vesselName}-${index}`}
                                    className={`timeline-item ${selectedShip === cruise.vesselName ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => handleShipSelect(cruise.vesselName)}
                                >
                                    {isToday && <div className="today-indicator">Today</div>}
                                    <div
                                        className="timeline-marker"
                                        style={{ backgroundColor: getCruiseLineColor(cruise.cruiseLine) }}
                                    >
                                        <span>{cruise.vesselName.charAt(0)}</span>
                                    </div>
                                    <div className="timeline-content">
                                        <div className="timeline-header-content">
                                            <h4 className="ship-name">{cruise.vesselName}</h4>
                                            <span className="terminal-badge">{cruise.berthCode}</span>
                                        </div>
                                        <div className="timeline-details">
                                            <div className="detail-item">
                                                <span className="detail-icon">📅</span>
                                                <span className="detail-text">{formatDate(cruise.arrivalTime)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">🕒</span>
                                                <span className="detail-text">
                                                    {cruiseService.extractTime(cruise.arrivalTime)} - {cruiseService.extractTime(cruise.departureTime)}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">⏱️</span>
                                                <span className="detail-text">
                                                    {cruiseService.calculateDuration(cruise.arrivalTime, cruise.departureTime)}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-icon">🏢</span>
                                                <span className="detail-text">{cruise.berth}</span>
                                            </div>
                                            <div className="detail-item cruise-line">
                                                <span
                                                    className="cruise-line-indicator"
                                                    style={{ backgroundColor: getCruiseLineColor(cruise.cruiseLine) }}
                                                ></span>
                                                <span className="detail-text">{cruise.cruiseLine}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="cruise-cards">
                        {sortedCruises.map((cruise, index) => {
                            const cruiseDate = new Date(cruise.arrivalTime);
                            cruiseDate.setHours(0, 0, 0, 0); // Reset time for date comparison

                            const isToday = cruiseDate.getTime() === today.getTime();

                            return (
                                <div
                                    key={`${cruise.vesselName}-${index}`}
                                    className={`cruise-card ${selectedShip === cruise.vesselName ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => handleShipSelect(cruise.vesselName)}
                                >
                                    {isToday && <div className="today-indicator">Today</div>}
                                    <div
                                        className="cruise-card-header"
                                        style={{ backgroundColor: getCruiseLineColor(cruise.cruiseLine) }}
                                    >
                                        <h4>{cruise.vesselName}</h4>
                                        <span className="terminal-badge">{cruise.berthCode}</span>
                                    </div>
                                    <div className="cruise-card-body">
                                        <div className="cruise-info">
                                            <span className="info-label">Date:</span>
                                            <span className="info-value">
                                                {formatDate(cruise.arrivalTime)}
                                            </span>
                                        </div>
                                        <div className="cruise-info">
                                            <span className="info-label">Time:</span>
                                            <span className="info-value">
                                                {cruiseService.extractTime(cruise.arrivalTime)} - {cruiseService.extractTime(cruise.departureTime)}
                                            </span>
                                        </div>
                                        <div className="cruise-info">
                                            <span className="info-label">Duration:</span>
                                            <span className="info-value">
                                                {cruiseService.calculateDuration(cruise.arrivalTime, cruise.departureTime)}
                                            </span>
                                        </div>
                                        <div className="cruise-info">
                                            <span className="info-label">Cruise Line:</span>
                                            <span className="info-value">{cruise.cruiseLine}</span>
                                        </div>
                                        <div className="cruise-info">
                                            <span className="info-label">Terminal:</span>
                                            <span className="info-value">{cruise.berth}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CruiseDashboard;