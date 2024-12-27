import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InternationalHeatmap = ({ flightData }) => {
    const labels = Object.keys(flightData.flight_count); // Time intervals
    const totalFlights = Object.values(flightData.flight_count).map(item => item.total); // Total flight counts for each interval

    const datasets = [
        {
            label: "Total Flights",
            data: totalFlights,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
    ];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const index = tooltipItem.dataIndex;
                        const total = totalFlights[index];
                        return [`Total Flights: ${total}`];
                    },
                },
            },
            title: {
                display: true,
                text: "Flight Count by Hour (International)",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Time Intervals",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Number of Flights",
                },
                beginAtZero: true,
            },
        },
    };

    return <Bar data={{ labels, datasets }} options={options} />;
};

export default InternationalHeatmap;
