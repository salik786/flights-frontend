import React, { useState, useEffect } from "react";
import Heatmap from "./Dashboard/domheatmap";  // Heatmap for both Domestic and International
import FlightStats from "./Dashboard/flightStats";
import './App.css';  // Add custom CSS for styling
import { Circles } from 'react-loader-spinner'; // Import Circles loader

const App = () => {
  const [flightData, setFlightData] = useState(null);
  const [selectedDate, setSelectedDate] = useState("today");
  const [selectedFlightType, setSelectedFlightType] = useState("domestic");
  const [loading, setLoading] = useState(false); // Add loading state

  const fetchFlightData = (date, flightType) => {
    setLoading(true);  // Show loading spinner
    console.log(`Fetching data for date: ${date} and flight type: ${flightType}`);
    fetch(`http://localhost:3001/api/flights?date=${date}&flightType=${flightType}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data: ", data);
        setFlightData(data);
        setLoading(false); // Hide loading spinner once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Hide loading spinner in case of error
      });
  };

  useEffect(() => {
    console.log("Selected date or flight type changed:", selectedDate, selectedFlightType);
    fetchFlightData(selectedDate, selectedFlightType);
  }, [selectedFlightType]);
  useEffect(() => {
    console.log("Selected date or flight type changed:", selectedDate, selectedFlightType);
    fetchFlightData(selectedDate, selectedFlightType);
  }, [selectedDate]);

  console.log("flightData:", flightData);

  return (
    <div className="app-container">
      <h1>Flight Heatmap</h1>

      {/* Filters for Date and Flight Type */}
      <div className="filters-container">
        <div className="filter-card">
          <h3>Select Date</h3>
          <select
            id="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="today">Today, {new Date().toLocaleDateString()}</option>
            <option value="yesterday">
              Yesterday, {new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()}
            </option>
            <option value="tomorrow">
              Tomorrow, {new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleDateString()}
            </option>
            <option value="day_after_tomorrow">
              Day after Tomorrow, {new Date(new Date().setDate(new Date().getDate() + 2)).toLocaleDateString()}
            </option>
          </select>
        </div>

        <div className="filter-card">
          <h3>Select Flight Type</h3>
          <select
            id="flight-type-filter"
            value={selectedFlightType}
            onChange={(e) => setSelectedFlightType(e.target.value)}
          >
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loader-container">
          <Circles color="#00BFFF" height={80} width={80} />
        </div>
      )}

      {/* Display Data */}
      {!loading && flightData ? (
        <>
          <FlightStats flightData={flightData.flight_statuses} />
          <Heatmap flightData={flightData} selectedFlightType={selectedFlightType} />
        </>
      ) : (
        !loading && <p>No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default App;
