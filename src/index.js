// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FlightProvider } from './context/FlightContext';
import ReactGA from 'react-ga4';

// Make sure this is at the top of your file
ReactGA.initialize('G-MN7KHGLZPG', {
  debug: false,
  testMode: false // Set to false to actually send events
});

console.log('GA4 Initialized with debug mode');




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FlightProvider>
      <App />
    </FlightProvider>
  </React.StrictMode>
);