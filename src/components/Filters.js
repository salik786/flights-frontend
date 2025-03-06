// src/components/Filters.js
import React from 'react';
import PropTypes from 'prop-types';
import './Filters.css';

const Filters = ({
    selectedDate,
    selectedFlightType,
    flightDirection,
    onDateChange,
    onFlightTypeChange,
    onDirectionChange
}) => {
    // Format dates for display
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    // Format date as string
    const formatDate = (date) => {
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="filters-container">
            <div className="filter-card">
                <h3>Select Date</h3>
                <select
                    id="date-filter"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="today">Today ({formatDate(today)})</option>
                    <option value="yesterday">Yesterday ({formatDate(yesterday)})</option>
                    <option value="tomorrow">Tomorrow ({formatDate(tomorrow)})</option>
                    <option value="day_after_tomorrow">
                        Day after Tomorrow ({formatDate(dayAfterTomorrow)})
                    </option>
                </select>
            </div>

            <div className="filter-card">
                <h3>Select Flight Type</h3>
                <select
                    id="flight-type-filter"
                    value={selectedFlightType}
                    onChange={(e) => onFlightTypeChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                </select>
            </div>

            <div className="filter-card">
                <h3>Select Direction</h3>
                <select
                    id="flight-direction-filter"
                    value={flightDirection}
                    onChange={(e) => onDirectionChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="departure">Departures</option>
                    <option value="arrival">Arrivals</option>
                </select>
            </div>
        </div>
    );
};

Filters.propTypes = {
    selectedDate: PropTypes.string.isRequired,
    selectedFlightType: PropTypes.string.isRequired,
    flightDirection: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onFlightTypeChange: PropTypes.func.isRequired,
    onDirectionChange: PropTypes.func.isRequired
};

export default Filters;