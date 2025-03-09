import React, { useState, useEffect } from "react";
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
import "./hourlyHistogram.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HourlyHistogram = ({ flightCount }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Convert 24-hour format to AM/PM
    const formatHourToAMPM = (hourRange) => {
        const [startHour, endHour] = hourRange.split("-").map(h => parseInt(h, 10));

        const formatHour = (hour) => {
            const period = hour >= 12 ? "PM" : "AM";
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}${period}`;
        };

        return `${formatHour(startHour)}-${formatHour(endHour)}`;
    };

    // Prepare data for Chart.js
    const hours = Object.keys(flightCount);
    const formattedHours = hours.map(hour => formatHourToAMPM(hour));

    const dataCountsT2 = hours.map(hour => flightCount[hour].T2 || 0);
    const dataCountsT3 = hours.map(hour => flightCount[hour].T3 || 0);
    const dataCountsTotal = hours.map(hour => flightCount[hour].total || 0);

    const chartData = {
        labels: formattedHours,
        datasets: [
            {
                label: "T2 Flights",
                data: dataCountsT2,
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                stack: 'stack0',
            },
            {
                label: "T3 Flights",
                data: dataCountsT3,
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                stack: 'stack0',
            },
            {
                label: "Total Flights",
                data: dataCountsTotal,
                type: 'line',
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.1,
                pointBackgroundColor: "rgba(54, 162, 235, 1)",
                pointRadius: 3,
                // Setting this to true will make the line chart appear on top of the bars
                order: 0,
                // Hide bars for total and just show line
                barPercentage: 0,
                hidden: windowWidth < 768, // Hide total line on mobile for clarity
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: windowWidth < 768 ? "bottom" : "top",
                labels: {
                    boxWidth: windowWidth < 768 ? 12 : 20,
                    font: {
                        size: windowWidth < 768 ? 10 : 12,
                    },
                },
            },
            title: {
                display: true,
                text: "Hourly Flight Distribution",
                font: {
                    size: windowWidth < 768 ? 14 : 16,
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function (tooltipItems) {
                        return `Time: ${tooltipItems[0].label}`;
                    },
                    footer: function (tooltipItems) {
                        const timeIndex = tooltipItems[0].dataIndex;
                        const t2Value = dataCountsT2[timeIndex];
                        const t3Value = dataCountsT3[timeIndex];
                        const total = t2Value + t3Value;

                        return [
                            `T2 Flights: ${t2Value}`,
                            `T3 Flights: ${t3Value}`,
                            '----------------------------------------',
                            `Total Flights: ${total}`
                        ];
                    },
                },
                displayColors: false,
                padding: 8,
                titleFont: {
                    size: windowWidth < 768 ? 11 : 12,
                },
                bodyFont: {
                    size: windowWidth < 768 ? 11 : 12,
                },
                footerFont: {
                    size: windowWidth < 768 ? 11 : 12,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: windowWidth >= 768,
                    text: "Time Intervals",
                    font: {
                        size: 12,
                    },
                },
                stacked: true,
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 9 : 11,
                    },
                    maxRotation: windowWidth < 768 ? 90 : 0,
                    minRotation: windowWidth < 768 ? 45 : 0,
                },
            },
            y: {
                title: {
                    display: windowWidth >= 768,
                    text: "Number of Flights",
                    font: {
                        size: 12,
                    },
                },
                beginAtZero: true,
                stacked: true,
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 9 : 11,
                    },
                },
            },
        },
    };

    return (
        <div className="histogram-container">
            <div className="chart-wrapper">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default HourlyHistogram;