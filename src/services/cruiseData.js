// src/services/cruiseData.js
import axios from 'axios';

// API endpoint for fetching cruise data
const API_URL = 'https://www.portauthoritynsw.com.au/umbraco/Api/CruiseScheduleAPI/GetCruiseSchedule';

// CORS proxy to avoid cross-origin issues
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Mock data to use if API call fails
const mockCruiseData = [
    {
        "arrivalTime": "2025-03-08T06:00:00",
        "departureTime": "2025-03-08T16:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Crown Princess",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "PRINCESS CRUISE LINES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-10T06:30:00",
        "departureTime": "2025-03-10T16:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Pacific Adventure",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "Carnival Plc",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-10T06:30:00",
        "departureTime": "2025-03-10T18:00:00",
        "berth": "White Bay Cruise Terminal",
        "berthCode": "WBCT",
        "vesselName": "Regatta",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "OCEANIA CRUISES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-12T06:00:00",
        "departureTime": "2025-03-12T16:30:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Celebrity Edge",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "Celebrity Cruises Inc",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-13T06:00:00",
        "departureTime": "2025-03-13T18:45:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Royal Princess",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "PRINCESS CRUISE LINES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-14T05:30:00",
        "departureTime": "2025-03-14T16:00:00",
        "berth": "White Bay Cruise Terminal",
        "berthCode": "WBCT",
        "vesselName": "Pacific Adventure",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "Carnival Plc",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-14T06:30:00",
        "departureTime": "2025-03-14T15:30:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Carnival Splendor",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "CARNIVAL CRUISE LINE",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-15T06:30:00",
        "departureTime": "2025-03-15T17:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Ovation of the Seas",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "ROYAL CARIBBEAN CRUISES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-16T06:00:00",
        "departureTime": "2025-03-16T16:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Royal Princess",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "PRINCESS CRUISE LINES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-19T06:00:00",
        "departureTime": "2025-03-19T18:45:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Crown Princess",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "PRINCESS CRUISE LINES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-20T06:30:00",
        "departureTime": "2025-03-21T23:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Viking Orion",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "Viking Ocean Cruises Ltd",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-22T06:30:00",
        "departureTime": "2025-03-22T17:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Ovation of the Seas",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "ROYAL CARIBBEAN CRUISES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-23T06:30:00",
        "departureTime": "2025-03-23T15:30:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Carnival Splendor",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "CARNIVAL CRUISE LINE",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-24T06:30:00",
        "departureTime": "2025-03-24T17:00:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Ovation of the Seas",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "ROYAL CARIBBEAN CRUISES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-25T06:00:00",
        "departureTime": "2025-03-25T16:30:00",
        "berth": "Overseas Passenger Terminal",
        "berthCode": "OPT",
        "vesselName": "Celebrity Edge",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "Celebrity Cruises Inc",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-29T06:30:00",
        "departureTime": "2025-03-29T16:00:00",
        "berth": "White Bay Cruise Terminal",
        "berthCode": "WBCT",
        "vesselName": "Pacific Adventure",
        "vesselWebSiteURL": null,
        "agent": "CVL",
        "cruiseLine": "Carnival Plc",
        "isRefresh": false,
        "portCode": "AUSYD"
    },
    {
        "arrivalTime": "2025-03-30T09:00:00",
        "departureTime": "2025-03-30T19:00:00",
        "berth": "White Bay Cruise Terminal",
        "berthCode": "WBCT",
        "vesselName": "Nautica",
        "vesselWebSiteURL": null,
        "agent": "WPS",
        "cruiseLine": "OCEANIA CRUISES LTD",
        "isRefresh": false,
        "portCode": "AUSYD"
    }
];

const cruiseService = {
    // Fetch cruise data from API or use mock data
    fetchCruiseData: async (month = 3, year = 2025) => {
        try {
            console.log('Attempting to fetch cruise data from API with CORS proxy...');

            // First try with CORS proxy
            const response = await axios.get(`${CORS_PROXY}${API_URL}`, {
                params: {
                    portCode: 'P01',
                    pageSize: 100, // Large enough to get all data for a month
                    pageNumber: 1
                },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest' // Required by cors-anywhere
                }
            });

            console.log('API response received:', response.data);

            const cruiseData = response.data.items || [];

            // Filter for the specified month and year
            const filteredData = cruiseData.filter(cruise => {
                const arrivalDate = new Date(cruise.arrivalTime);
                return arrivalDate.getMonth() + 1 === month && arrivalDate.getFullYear() === year;
            });

            return filteredData;
        } catch (error) {
            console.error('Error fetching cruise data from API:', error);
            console.log('Falling back to mock data...');

            // Filter mock data for the specified month
            const filteredMockData = mockCruiseData.filter(cruise => {
                const arrivalDate = new Date(cruise.arrivalTime);
                return arrivalDate.getMonth() + 1 === month && arrivalDate.getFullYear() === year;
            });

            return filteredMockData;
        }
    },

    // Get only OPT and WBCT terminal cruises
    getMainTerminalCruises: async (month = 3, year = 2025) => {
        try {
            const allCruises = await cruiseService.fetchCruiseData(month, year);

            // Filter for only OPT and WBCT berths
            return allCruises.filter(cruise =>
                cruise.berthCode === 'OPT' || cruise.berthCode === 'WBCT');
        } catch (error) {
            console.error('Error getting main terminal cruises:', error);
            // Return only OPT and WBCT cruises from mock data
            return mockCruiseData.filter(cruise =>
                cruise.berthCode === 'OPT' || cruise.berthCode === 'WBCT');
        }
    },

    // Get cruises for a specific date
    getCruisesByDate: async (date, month = 3, year = 2025) => {
        try {
            const mainTerminalCruises = await cruiseService.getMainTerminalCruises(month, year);

            // Convert the target date to a string format for comparison (YYYY-MM-DD)
            const targetDateStr = date.toISOString().split('T')[0];

            // Filter cruises for the specific date
            return mainTerminalCruises.filter(cruise => {
                const cruiseArrivalDate = new Date(cruise.arrivalTime).toISOString().split('T')[0];
                return cruiseArrivalDate === targetDateStr;
            });
        } catch (error) {
            console.error('Error getting cruises by date:', error);
            return [];
        }
    },

    // Get cruises by terminal code
    getCruisesByTerminal: async (terminalCode, month = 3, year = 2025) => {
        try {
            const mainTerminalCruises = await cruiseService.getMainTerminalCruises(month, year);

            if (terminalCode === 'all') {
                return mainTerminalCruises;
            }

            return mainTerminalCruises.filter(cruise => cruise.berthCode === terminalCode);
        } catch (error) {
            console.error('Error getting cruises by terminal:', error);
            return [];
        }
    },

    // Get cruise statistics
    getCruiseStats: async (month = 3, year = 2025) => {
        try {
            const mainTerminalCruises = await cruiseService.getMainTerminalCruises(month, year);

            const stats = {
                totalCruises: mainTerminalCruises.length,
                byTerminal: {
                    OPT: mainTerminalCruises.filter(cruise => cruise.berthCode === 'OPT').length,
                    WBCT: mainTerminalCruises.filter(cruise => cruise.berthCode === 'WBCT').length
                },
                byShip: {}
            };

            // Count cruises by ship
            mainTerminalCruises.forEach(cruise => {
                if (!stats.byShip[cruise.vesselName]) {
                    stats.byShip[cruise.vesselName] = 0;
                }
                stats.byShip[cruise.vesselName]++;
            });

            return stats;
        } catch (error) {
            console.error('Error getting cruise stats:', error);

            // Generate stats from mock data
            const filteredMockData = mockCruiseData.filter(cruise =>
                (cruise.berthCode === 'OPT' || cruise.berthCode === 'WBCT'));

            const mockStats = {
                totalCruises: filteredMockData.length,
                byTerminal: {
                    OPT: filteredMockData.filter(cruise => cruise.berthCode === 'OPT').length,
                    WBCT: filteredMockData.filter(cruise => cruise.berthCode === 'WBCT').length
                },
                byShip: {}
            };

            filteredMockData.forEach(cruise => {
                if (!mockStats.byShip[cruise.vesselName]) {
                    mockStats.byShip[cruise.vesselName] = 0;
                }
                mockStats.byShip[cruise.vesselName]++;
            });

            return mockStats;
        }
    },

    // Utility function to format dates from API
    formatDate: (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    },

    // Utility function to extract time from datetime string
    extractTime: (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    // Calculate docking duration between arrival and departure
    calculateDuration: (arrivalTime, departureTime) => {
        const arrival = new Date(arrivalTime);
        const departure = new Date(departureTime);

        const durationMs = departure - arrival;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));

        return `${hours} hours`;
    }
};

export default cruiseService;