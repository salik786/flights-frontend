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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Heatmap = ({ flightData, selectedFlightType }) => {
    const labels = Object.keys(flightData.flight_count);
    const dataCountsT2 = [];
    const dataCountsT3 = [];
    const dataCountsTotal = [];

    labels.forEach((hour) => {
        const data = flightData.flight_count[hour];
        if (selectedFlightType === "domestic") {
            dataCountsT2.push(data.T2 || 0);
            dataCountsT3.push(data.T3 || 0);
        } else if (selectedFlightType === "international") {
            dataCountsTotal.push(data.total || 0);
        }
    });

    const data = {
        labels,
        datasets: [
            ...(selectedFlightType === "domestic"
                ? [
                    {
                        label: "T2 Flights",
                        data: dataCountsT2,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        stack: 'stack0',
                    },
                    {
                        label: "T3 Flights",
                        data: dataCountsT3,
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        stack: 'stack0',
                    },
                ]
                : []),
            ...(selectedFlightType === "international"
                ? [
                    {
                        label: "Total Flights",
                        data: dataCountsTotal,
                        backgroundColor: "rgba(153, 102, 255, 0.6)",
                    },
                ]
                : []),
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // This allows us to control height independently
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: selectedFlightType === "domestic"
                    ? "Domestic Flight Count per Hour (T2 & T3)"
                    : "International Flight Count per Hour",
                font: {
                    size: 14 // Reduced title font size
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
                    display: true,
                    text: "Time Intervals",
                    font: {
                        size: 12 // Reduced axis title font size
                    }
                },
                stacked: true,
                ticks: {
                    font: {
                        size: 11 // Reduced x-axis labels font size
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Number of Flights",
                    font: {
                        size: 12 // Reduced axis title font size
                    }
                },
                beginAtZero: true,
                stacked: true,
                ticks: {
                    font: {
                        size: 11 // Reduced y-axis labels font size
                    }
                }
            },
        },
    };

    // Wrapper div with controlled size
    return (
        <div style={{
            width: '100%',
            height: '600px', // Fixed height
            maxWidth: '1600px', // Maximum width
            margin: '0 auto' // Center the chart
        }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default Heatmap;