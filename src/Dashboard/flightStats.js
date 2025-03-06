// src/Dashboard/flightStats.js
import React from 'react';
import PropTypes from 'prop-types';
import './flightStats.css';

const FlightStats = ({ flightData }) => {
    if (!flightData) return null;

    const { on_time = 0, delayed = 0, cancelled = 0 } = flightData;
    const total = on_time + delayed + cancelled;

    // Calculate percentages
    const onTimePercent = total > 0 ? Math.round((on_time / total) * 100) : 0;
    const delayedPercent = total > 0 ? Math.round((delayed / total) * 100) : 0;
    const cancelledPercent = total > 0 ? Math.round((cancelled / total) * 100) : 0;

    return (
        <div className="flight-stats-container">
            <h2>Flight Status Summary</h2>

            <div className="stats-cards">
                <div className="stat-card on-time">
                    <div className="stat-icon">✓</div>
                    <div className="stat-content">
                        <h3>On Time</h3>
                        <p className="stat-number">{on_time}</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${onTimePercent}%` }}></div>
                        </div>
                        <p className="stat-percent">{onTimePercent}%</p>
                    </div>
                </div>

                <div className="stat-card delayed">
                    <div className="stat-icon">⏱</div>
                    <div className="stat-content">
                        <h3>Delayed</h3>
                        <p className="stat-number">{delayed}</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${delayedPercent}%` }}></div>
                        </div>
                        <p className="stat-percent">{delayedPercent}%</p>
                    </div>
                </div>

                <div className="stat-card cancelled">
                    <div className="stat-icon">✗</div>
                    <div className="stat-content">
                        <h3>Cancelled</h3>
                        <p className="stat-number">{cancelled}</p>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${cancelledPercent}%` }}></div>
                        </div>
                        <p className="stat-percent">{cancelledPercent}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

FlightStats.propTypes = {
    flightData: PropTypes.shape({
        on_time: PropTypes.number,
        delayed: PropTypes.number,
        cancelled: PropTypes.number
    })
};

export default FlightStats;