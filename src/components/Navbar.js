// src/components/Navbar.js
import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMenuOpen(false); // Close mobile menu when tab is selected
    };

    return (
        <nav className="main-navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <div className="logo-icon">
                        <span className="logo-plane">✈️</span>
                        <span className="logo-ship">🚢</span>
                    </div>
                    <h1 className="logo-text">Sydney Transport Hub</h1>
                </div>

                {/* Mobile menu toggle */}
                <button
                    className={`menu-toggle ${menuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation items */}
                <div className={`navbar-items ${menuOpen ? 'open' : ''}`}>
                    <div
                        className={`nav-item ${activeTab === 'flights' ? 'active' : ''}`}
                        onClick={() => handleTabClick('flights')}
                    >
                        <div className="nav-icon">✈️</div>
                        <span className="nav-text">Flight Dashboard</span>
                    </div>
                    <div
                        className={`nav-item ${activeTab === 'cruises' ? 'active' : ''}`}
                        onClick={() => handleTabClick('cruises')}
                    >
                        <div className="nav-icon">🚢</div>
                        <span className="nav-text">Cruise Schedule</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;