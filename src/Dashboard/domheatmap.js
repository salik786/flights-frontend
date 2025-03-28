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

// Completely reset Chart.js before registering components
// This will remove any existing plugins
if (ChartJS.helpers && ChartJS.helpers.each && ChartJS.registry && ChartJS.registry.plugins) {
    // Try to remove all plugins
    const plugins = [...ChartJS.registry.plugins.items];
    plugins.forEach(plugin => {
        try {
            ChartJS.unregister(plugin);
        } catch (e) {
            // Ignore errors
        }
    });
}

// Register only the components we need
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// If you have access to import the Chart class directly, you could do a reset like:
// Chart.defaults.plugins.datalabels = { display: false };

const Heatmap = ({ flightData, selectedFlightType }) => {
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

        // Fix for the 24th hour (should be 12AM not 12PM)
        if (endHour === 24) {
            return `${formatHour(startHour)}-12AM`;
        }

        return `${formatHour(startHour)}-${formatHour(endHour)}`;
    };

    // Get original labels and format them to AM/PM
    const originalLabels = Object.keys(flightData.flight_count);
    const formattedLabels = originalLabels.map(formatHourToAMPM);

    const dataCountsT2 = [];
    const dataCountsT3 = [];
    const dataCountsTotal = [];

    originalLabels.forEach((hour) => {
        const data = flightData.flight_count[hour];
        if (selectedFlightType === "domestic") {
            dataCountsT2.push(data.T2 || 0);
            dataCountsT3.push(data.T3 || 0);
        }
        dataCountsTotal.push(data.total || 0);
    });

    const data = {
        labels: formattedLabels,
        datasets: [
            ...(selectedFlightType === "domestic"
                ? [
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
                ]
                : []),
            ...(selectedFlightType === "international"
                ? [
                    {
                        label: "Total Flights",
                        data: dataCountsTotal,
                        backgroundColor: "rgba(153, 102, 255, 0.7)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1,
                    },
                ]
                : []),
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            // Explicitly disable any possible label plugins
            datalabels: { display: false },
            labels: false,
            outlabels: false,
            totalLabels: false,
            totalLabelsHorizontal: false,
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
                text: selectedFlightType === "domestic"
                    ? "Domestic Flight Count per Hour (T2 & T3)"
                    : "International Flight Count per Hour",
                font: {
                    size: windowWidth < 768 ? 14 : 16,
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function (tooltipItems) {
                        return `Time: ${tooltipItems[0].label}`;
                    },
                    label: function () {
                        return null;
                    },
                    footer: function (tooltipItems) {
                        if (selectedFlightType === "domestic") {
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
                        }
                        return '';
                    },
                },
                displayColors: false,
                padding: 8,
                titleFont: {
                    size: 12,
                },
                footerFont: {
                    size: 12
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                footerColor: 'white',
            }
        },
        scales: {
            x: {
                title: {
                    display: windowWidth >= 768,
                    text: "Time Intervals",
                    font: {
                        size: 12
                    }
                },
                stacked: true,
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 9 : 11,
                    },
                    maxRotation: windowWidth < 768 ? 90 : 0,
                    minRotation: windowWidth < 768 ? 45 : 0,
                },
                grid: {
                    display: windowWidth >= 480,
                }
            },
            y: {
                title: {
                    display: windowWidth >= 768,
                    text: "Number of Flights",
                    font: {
                        size: 12
                    }
                },
                beginAtZero: true,
                stacked: selectedFlightType === "domestic",
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 9 : 11,
                    }
                }
            },
        }
    };

    // Dynamic height based on screen size
    const chartHeight = windowWidth < 480 ? '400px' :
        windowWidth < 768 ? '500px' : '600px';

    return (
        <div className="heatmap-container">
            <div className="heatmap-chart" style={{
                height: chartHeight,
                width: '100%',
                maxWidth: '1600px',
                margin: '0 auto'
            }}>
                <Bar data={data} options={options} key={Math.random()} />
            </div>
        </div>
    );
};

export default Heatmap;