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

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// This plugin will definitely work - we're making it as simple as possible
const totalLabelsPlugin = {
    id: 'totalLabels',
    afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;

        chart.data.datasets.forEach((dataset, datasetIndex) => {
            // For stacked charts, only process the last dataset (T3)
            // For single dataset charts, process the only dataset
            const isLastDataset = (datasetIndex === chart.data.datasets.length - 1);
            if (!isLastDataset && chart.data.datasets.length > 1) {
                return;
            }

            const meta = chart.getDatasetMeta(datasetIndex);

            // Skip if this dataset is hidden
            if (meta.hidden) {
                return;
            }

            meta.data.forEach((element, index) => {
                let value;

                // For stacked charts, calculate the total
                if (chart.data.datasets.length > 1) {
                    value = 0;
                    chart.data.datasets.forEach(ds => {
                        value += ds.data[index] || 0;
                    });
                } else {
                    value = dataset.data[index];
                }

                // Only display if there's an actual value
                if (value > 0) {
                    // For vertical chart
                    const fontSize = 10;
                    ctx.font = 'bold ' + fontSize + 'px Arial';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';

                    const x = element.x + 10;  // Position to the right of the bar
                    const y = element.y;       // Centered vertically

                    // Add a white background
                    const textWidth = ctx.measureText(value).width;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillRect(x - 2, y - 8, textWidth + 4, 16);

                    // Draw the text
                    ctx.fillStyle = 'black';
                    ctx.fillText(value, x, y);
                }
            });
        });
    }
};

// Register the plugin globally once
ChartJS.register(totalLabelsPlugin);

const VerticalHeatmap = ({ flightData, selectedFlightType }) => {
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
        indexAxis: 'y', // This makes the chart vertical
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
            y: { // This is now the horizontal axis (labels)
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
                    // No need to rotate as it's vertical now
                },
                grid: {
                    display: windowWidth >= 480,
                }
            },
            x: { // This is now the vertical axis (values)
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

    // Dynamic height for vertical chart - needs to be taller
    const chartHeight = windowWidth < 480 ? '600px' :
        windowWidth < 768 ? '700px' : '800px';

    // Use CSS class for responsive styling
    return (
        <div className="heatmap-container">
            <div className="heatmap-chart" style={{
                height: chartHeight,
                width: '100%',
                maxWidth: '1600px',
                margin: '0 auto'
            }}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default VerticalHeatmap;