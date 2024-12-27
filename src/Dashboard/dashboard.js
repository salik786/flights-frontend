import React, { useEffect, useState } from 'react';
import HeatMap from 'react-heatmap-grid';

const Dashboard = () => {
    const [flightData, setFlightData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/flights')
            .then(res => res.json())
            .then(data => {
                setFlightData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!flightData) {
        return <div>Error loading data.</div>;
    }

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00-${i + 1}:00`);
    const onTimeCounts = hours.map(hour => flightData.flight_count[hour] || 0);

    return (
        <div>
            <h1>Flight Dashboard for {flightData.airport} on {flightData.date}</h1>
            <p>On Time Flights: {flightData.flight_statuses.on_time}</p>
            <p>Cancelled Flights: {flightData.flight_statuses.cancelled}</p>
            <p>Delayed Flights: {flightData.flight_statuses.delayed}</p>

            <h2>On-Time Flight Heatmap</h2>
            <HeatMap
                xLabels={hours}
                yLabels={['Flights']}
                data={[onTimeCounts]}
                squares
                cellHeight={50}
                cellWidth={50}
                xLabelWidth={100}
            />
        </div>
    );
};

export default Dashboard;
