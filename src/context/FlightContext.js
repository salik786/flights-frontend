// src/context/FlightContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import flightService from '../services/api';

// Create context
const FlightContext = createContext();

// Custom hook to use the flight context
export const useFlightData = () => useContext(FlightContext);

// Provider component
export const FlightProvider = ({ children }) => {
    const [flightData, setFlightData] = useState(null);
    const [selectedDate, setSelectedDate] = useState('today');
    const [selectedFlightType, setSelectedFlightType] = useState('domestic');
    const [flightDirection, setFlightDirection] = useState('departure');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch flight data
    const fetchFlightData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log(`Fetching data for date: ${selectedDate}, flight type: ${selectedFlightType}, direction: ${flightDirection}`);

            const data = await flightService.getFlightData(
                selectedDate,
                selectedFlightType,
                flightDirection
            );

            console.log("Fetched data:", data);
            setFlightData(data);
        } catch (err) {
            console.error("Error fetching flight data:", err);
            setError(err.message || 'Failed to fetch flight data');
            setFlightData(null);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when selected filters change
    useEffect(() => {
        fetchFlightData();
    }, [selectedDate, selectedFlightType, flightDirection]);

    // Function to manually refresh data
    const refreshData = () => {
        fetchFlightData();
    };

    // Context value
    const contextValue = {
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
    };

    return (
        <FlightContext.Provider value={contextValue}>
            {children}
        </FlightContext.Provider>
    );
};

export default FlightContext;