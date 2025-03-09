// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navbarRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMenuOpen(false); // Close mobile menu when tab is selected
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close menu when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && menuOpen) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [menuOpen]);

    return (
        <nav className="main-navbar" ref={navbarRef}>
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

                {/* Navigation items - adding overlay for mobile */}
                <div className={`navbar-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}></div>
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