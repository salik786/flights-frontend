import React from "react";

const FlightStats = ({ flightData }) => {
    // Check if flightData exists and flight_statuses is not undefined
    const flightStatus = flightData || {};  // Default to empty object if undefined
    console.log("flightstatus", flightData)
    const { on_time = 0, cancelled = 0, delayed = 0 } = flightStatus;  // Default values

    return (
        <div style={styles.container}>
            {/* <div style={styles.statBox}>
                <h3 style={styles.heading}>On-Time Flights</h3>
                <p style={styles.count}>{on_time}</p>
            </div> */}
            <div style={styles.statBox}>
                <h3 style={styles.heading}>Total Flights </h3>
                <p style={styles.count}>{delayed}</p>
            </div>
            <div style={styles.statBox}>
                <h3 style={styles.heading}>Cancelled Flights</h3>
                <p style={styles.count}>{cancelled}</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "space-around",
        margin: "20px 0",
        padding: "5px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 4px 8px 5px rgba(0, 0, 0, 12%)",
    },
    statBox: {
        textAlign: "center",
        padding: "10px",
    },
    heading: {
        fontSize: "1.2em",
        marginBottom: "10px",
        color: "#333",
    },
    count: {
        fontSize: "1.5em",
        fontWeight: "bold",
        color: "#007bff",
    },
};

export default FlightStats;
