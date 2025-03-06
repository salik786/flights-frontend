// src/components/LoadingIndicator.js
import React, { useState, useEffect } from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Connecting to server...');

  useEffect(() => {
    // For free tier indication - simulated progress to communicate the app is still working
    const initialDelay = setTimeout(() => {
      // Start progress after a small delay
      let currentProgress = 0;

      // Different loading messages based on progress
      const loadingMessages = [
        { threshold: 0, message: 'Connecting to server...' },
        { threshold: 10, message: 'Server is warming up (free tier)...' },
        { threshold: 30, message: 'Fetching flight data...' },
        { threshold: 60, message: 'Processing flight information...' },
        { threshold: 80, message: 'Preparing visualization...' },
        { threshold: 95, message: 'Almost ready...' }
      ];

      // Create interval that increases progress gradually
      // This isn't actual progress but gives user feedback during long wait times
      const interval = setInterval(() => {
        // Use a slower progression as we get further along
        const increment = currentProgress < 30 ? 2 :
          currentProgress < 60 ? 1 :
            currentProgress < 80 ? 0.7 :
              currentProgress < 90 ? 0.5 : 0.2;

        currentProgress += increment;

        // Update loading message based on progress
        for (let i = loadingMessages.length - 1; i >= 0; i--) {
          if (currentProgress >= loadingMessages[i].threshold) {
            setMessage(loadingMessages[i].message);
            break;
          }
        }

        // Cap at 98% - will go to 100% only when data actually arrives
        if (currentProgress >= 98) {
          clearInterval(interval);
          currentProgress = 98;
        }

        setProgress(Math.min(98, currentProgress));
      }, 350);

      return () => {
        clearInterval(interval);
        clearTimeout(initialDelay);
      };
    }, 500);

    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <div className="loading-progress-bar">
          <div
            className="loading-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="loading-message">{message}</div>
        <div className="loading-percentage">{Math.round(progress)}%</div>
        <div className="loading-note">
          Free tier may take up to 60 seconds to respond
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;