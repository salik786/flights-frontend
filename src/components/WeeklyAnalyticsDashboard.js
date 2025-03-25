import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import analyticsService from "../services/analyticsService";
import "./weeklyAnalytics.css";

// Reset and register ChartJS components
if (ChartJS.helpers && ChartJS.helpers.each && ChartJS.registry && ChartJS.registry.plugins) {
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
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const WeeklyAnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flightType, setFlightType] = useState("domestic");
    const [flightDirection, setFlightDirection] = useState("arrival");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch analytics data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await analyticsService.getWeeklyAnalytics(
                    "today",
                    flightType,
                    flightDirection
                );
                setAnalyticsData(data);
            } catch (err) {
                console.error("Error fetching analytics data:", err);
                setError("Failed to load analytics data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [flightType, flightDirection]);

    // Format day of week for display
    const formatDayName = (day) => {
        const days = {
            monday: "Mon",
            tuesday: "Tue",
            wednesday: "Wed",
            thursday: "Thu",
            friday: "Fri",
            saturday: "Sat",
            sunday: "Sun",
        };
        return days[day] || day;
    };

    // Prepare weekly flight data
    const getWeeklyChartData = () => {
        if (!analyticsData) return { labels: [], datasets: [] };

        // Get days in the correct order (start with Monday)
        const orderedDays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];

        const labels = orderedDays.map(formatDayName);
        const flightCounts = orderedDays.map(
            (day) => analyticsData.flightsByDayOfWeek[day] || 0
        );

        return {
            labels,
            datasets: [
                {
                    label: "Flights",
                    data: flightCounts,
                    backgroundColor: "rgba(75, 192, 192, 0.7)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    borderRadius: 4,
                },
            ],
        };
    };

    // Prepare airline distribution data
    const getAirlineChartData = () => {
        if (!analyticsData?.airlineDistribution) return { labels: [], datasets: [] };

        // Sort airlines by flight count (descending)
        const sortedAirlines = Object.entries(analyticsData.airlineDistribution)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5 airlines

        return {
            labels: sortedAirlines.map(([airline]) => airline),
            datasets: [
                {
                    data: sortedAirlines.map(([_, count]) => count),
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.7)",
                        "rgba(255, 99, 132, 0.7)",
                        "rgba(54, 162, 235, 0.7)",
                        "rgba(255, 206, 86, 0.7)",
                        "rgba(153, 102, 255, 0.7)",
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // Prepare flight status data
    const getStatusChartData = () => {
        if (!analyticsData?.statusDistribution) return { labels: [], datasets: [] };

        // Format the labels for better display
        const statusLabels = {
            "on_time": "On Time",
            "delayed": "Delayed",
            "cancelled": "Cancelled"
        };

        const labels = Object.keys(analyticsData.statusDistribution).map(
            status => statusLabels[status] || status
        );

        const data = Object.values(analyticsData.statusDistribution);

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.7)", // green (on time)
                        "rgba(255, 206, 86, 0.7)", // yellow (delayed)
                        "rgba(255, 99, 132, 0.7)", // red (cancelled)
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // Prepare terminal distribution data
    const getTerminalChartData = () => {
        if (!analyticsData?.terminalDistribution) return { labels: [], datasets: [] };

        return {
            labels: ["Terminal 2", "Terminal 3"],
            datasets: [
                {
                    data: [
                        analyticsData.terminalDistribution.T2 || 0,
                        analyticsData.terminalDistribution.T3 || 0,
                    ],
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.7)", // T2
                        "rgba(255, 99, 132, 0.7)", // T3
                    ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // Prepare peak hours data
    const getPeakHoursData = () => {
        if (!analyticsData?.peakHours?.byDay) return { labels: [], datasets: [] };

        const entries = Object.entries(analyticsData.peakHours.byDay);
        if (entries.length === 0) return { labels: [], datasets: [] };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        };

        return {
            labels: entries.map(([date]) => formatDate(date)),
            datasets: [
                {
                    label: "Peak Hour Count",
                    data: entries.map(([_, info]) => info.count),
                    backgroundColor: "rgba(54, 162, 235, 0.4)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                },
            ],
        };
    };

    // Chart.js options for weekly chart
    const weeklyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function (tooltipItems) {
                        const day = tooltipItems[0].label;
                        return day;
                    },
                    label: function (context) {
                        return `Flights: ${context.raw}`;
                    },
                },
                displayColors: false,
                padding: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
            },
            title: {
                display: true,
                text: 'Weekly Flight Distribution',
                font: {
                    size: windowWidth < 768 ? 14 : 16,
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 10 : 12,
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 10 : 12,
                    },
                    precision: 0,
                },
            },
        },
    };

    // Chart.js options for pie charts
    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 15,
                    boxWidth: windowWidth < 768 ? 12 : 20,
                    font: {
                        size: windowWidth < 768 ? 10 : 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
                displayColors: false,
                padding: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
            },
        },
    };

    // Chart.js options for line chart
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function (tooltipItems) {
                        return tooltipItems[0].label;
                    },
                    label: function (context) {
                        return `Peak Hour Flights: ${context.raw}`;
                    },
                },
                displayColors: false,
                padding: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
            },
            title: {
                display: true,
                text: 'Daily Peak Hours',
                font: {
                    size: windowWidth < 768 ? 14 : 16,
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 9 : 11,
                    },
                    maxRotation: windowWidth < 768 ? 45 : 0,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: windowWidth < 768 ? 10 : 12,
                    },
                    precision: 0,
                },
            },
        },
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="weekly-analytics-loading">
                <div className="loader"></div>
                <p>Loading analytics data...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="weekly-analytics-error">
                <div className="error-icon">!</div>
                <h2>Error Loading Data</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    // No data state
    if (!analyticsData) {
        return (
            <div className="weekly-analytics-no-data">
                <div className="info-icon">i</div>
                <h2>No Data Available</h2>
                <p>Please fetch flight data for at least one day before viewing analytics.</p>
                <button onClick={() => window.location.reload()}>
                    Refresh
                </button>
            </div>
        );
    }

    return (
        <div className="weekly-analytics-container">
            <div className="weekly-analytics-header">
                <h1>Sydney Airport Weekly Analytics</h1>
                <p>{analyticsData.weekStartDate} to {analyticsData.weekEndDate}</p>
            </div>

            <div className="weekly-analytics-content">
                <div className="weekly-analytics-controls">
                    <div className="control-info">
                        <h2>Flight Analytics</h2>
                        <p>
                            Overview for {flightType} {flightDirection}s
                        </p>
                    </div>
                    <div className="control-filters">
                        <div className="filter-group">
                            <select
                                value={flightType}
                                onChange={(e) => setFlightType(e.target.value)}
                                className="filter-select"
                            >
                                <option value="domestic">Domestic</option>
                                <option value="international">International</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <select
                                value={flightDirection}
                                onChange={(e) => setFlightDirection(e.target.value)}
                                className="filter-select"
                            >
                                <option value="arrival">Arrivals</option>
                                <option value="departure">Departures</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="analytics-stats">
                    {/* Total Flights */}
                    <div className="stats-card">
                        <div className="stats-icon total">✈️</div>
                        <div className="stats-content">
                            <h3>Total Flights</h3>
                            <p>{analyticsData.totalFlights.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* On-time Flights */}
                    <div className="stats-card">
                        <div className="stats-icon on-time">✓</div>
                        <div className="stats-content">
                            <h3>On Time</h3>
                            <p>{analyticsData.statusDistribution?.on_time?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    {/* Delayed Flights */}
                    <div className="stats-card">
                        <div className="stats-icon delayed">⏱</div>
                        <div className="stats-content">
                            <h3>Delayed</h3>
                            <p>{analyticsData.statusDistribution?.delayed?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    {/* Cancelled Flights */}
                    <div className="stats-card">
                        <div className="stats-icon cancelled">✕</div>
                        <div className="stats-content">
                            <h3>Cancelled</h3>
                            <p>{analyticsData.statusDistribution?.cancelled?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="analytics-charts">
                    {/* Weekly Chart */}
                    <div className="chart-card large">
                        <div className="chart-header">
                            <h3>Weekly Flight Distribution</h3>
                            {analyticsData.busiestDay && (
                                <div className="chart-badge">
                                    Busiest: {formatDayName(analyticsData.busiestDay.day)} ({analyticsData.busiestDay.count})
                                </div>
                            )}
                        </div>
                        <div className="chart-container">
                            <Bar data={getWeeklyChartData()} options={weeklyChartOptions} />
                        </div>
                    </div>

                    {/* Peak Hours */}
                    <div className="chart-card large">
                        <div className="chart-header">
                            <h3>Daily Peak Hours</h3>
                            {analyticsData.peakHours?.overall && (
                                <div className="chart-badge">
                                    Peak: {analyticsData.peakHours.overall.hour} ({analyticsData.peakHours.overall.count})
                                </div>
                            )}
                        </div>
                        <div className="chart-container">
                            <Line data={getPeakHoursData()} options={lineChartOptions} />
                        </div>
                    </div>

                    {/* Flight Status */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Flight Status</h3>
                        </div>
                        <div className="chart-container pie-container">
                            <Pie data={getStatusChartData()} options={pieChartOptions} />
                        </div>
                    </div>

                    {/* Top Airlines */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Top Airlines</h3>
                        </div>
                        <div className="chart-container pie-container">
                            <Pie data={getAirlineChartData()} options={pieChartOptions} />
                        </div>
                    </div>

                    {/* Terminal Distribution */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Terminal Distribution</h3>
                        </div>
                        <div className="chart-container pie-container">
                            <Pie data={getTerminalChartData()} options={pieChartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyAnalyticsDashboard;