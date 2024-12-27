import React from "react";
import './hourlyHistogram.css';

const HourlyHistogram = ({ flightCount }) => {
    const hours = Object.keys(flightCount);

    return (
        <div className="histogram-container">
            <h2>Hourly Flight Distribution (T2, T3, Total)</h2>
            <div className="histogram">
                {hours.map((hour) => {
                    const { T2, T3, total } = flightCount[hour];
                    return (
                        <div className="histogram-bar" key={hour}>
                            <div className="hour-label">{hour}</div>
                            <div className="bar-container">
                                <div className="bar t2" style={{ height: `${T2 * 50}px` }} title={`T2: ${T2}`}></div>
                                <div className="bar t3" style={{ height: `${T3 * 50}px` }} title={`T3: ${T3}`}></div>
                                <div className="bar total" style={{ height: `${total * 10}px` }} title={`Total: ${total}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HourlyHistogram;
