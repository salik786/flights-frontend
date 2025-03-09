import React, { useState } from 'react';

import VerticalHeatmap from './VerticalHeatmap';
import './ChartToggle.css';
import Heatmap from './domheatmap';

const ChartToggle = ({ flightData, selectedFlightType }) => {
    const [chartType, setChartType] = useState('vertical'); // 'horizontal' or 'vertical'

    return (
        <div className="chart-toggle-container">
            <div className="chart-toggle-header">
                <h3>Flight Distribution</h3>
                <div className="toggle-buttons">
                    <button
                        className={`toggle-btn ${chartType === 'horizontal' ? 'active' : ''}`}
                        onClick={() => setChartType('horizontal')}
                    >
                        <span className="toggle-icon">═</span>
                        Horizontal
                    </button>
                    <button
                        className={`toggle-btn ${chartType === 'vertical' ? 'active' : ''}`}
                        onClick={() => setChartType('vertical')}
                    >
                        <span className="toggle-icon">║</span>
                        Vertical
                    </button>
                </div>
            </div>

            {chartType === 'horizontal' ? (
                <Heatmap flightData={flightData} selectedFlightType={selectedFlightType} />
            ) : (
                <VerticalHeatmap flightData={flightData} selectedFlightType={selectedFlightType} />
            )}
        </div>
    );
};

export default ChartToggle;