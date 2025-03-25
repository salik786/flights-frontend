// src/services/analyticsService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:50015' || 'http://localhost:3001';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 seconds timeout
});

// Add request interceptor for logging, auth tokens, etc.
apiClient.interceptors.request.use(
    (config) => {
        // You can add authentication headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Handle common errors
        const { response } = error;

        if (response && response.status === 401) {
            // Handle unauthorized error
            console.error('Unauthorized access');
        } else if (response && response.status === 404) {
            // Handle not found error
            console.error('Resource not found');
        } else if (!response) {
            // Handle network errors
            console.error('Network error - please check your connection');
        }

        return Promise.reject(error);
    }
);

// Analytics API calls
export const analyticsService = {
    // Get weekly analytics
    getWeeklyAnalytics: async (date = 'today', flightType = 'domestic', flightDirection = 'arrival') => {
        try {
            return await apiClient.get('/api/analytics/weekly', {
                params: { date, flightType, flightDirection }
            });
        } catch (error) {
            console.error('Error fetching weekly analytics:', error);
            throw error;
        }
    },

    // Debug endpoint to check database data
    getDebugInfo: async () => {
        try {
            return await apiClient.get('/api/analytics/debug');
        } catch (error) {
            console.error('Error fetching debug data:', error);
            throw error;
        }
    }
};

export default analyticsService;