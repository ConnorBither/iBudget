import React, { useState } from 'react';
import './LoginPage.css'; // Reusing the existing CSS for consistency
import './Calendar.css'; // Custom CSS for the calendar
import Calendar from './Calendar.js';
import { Link, useNavigate } from 'react-router-dom';

function Recommendations() {
  const [view, setView] = useState('weekly'); // State for toggling calendar views
  const navigate = useNavigate();
  return (
    <div className="login-page">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="logo" />
        </div>
        <button className="home-button" onClick={() => navigate('/')}>
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="sign-in-title">Your Budgeting Recommendations</h1>

        {/* Calendar View Toggle */}
        <div className="calendar-toggle">
          <button
            className={`toggle-button ${view === 'weekly' ? 'active' : ''}`}
            onClick={() => setView('weekly')}
          >
            Weekly View
          </button>
          <button
            className={`toggle-button ${view === 'monthly' ? 'active' : ''}`}
            onClick={() => setView('monthly')}
          >
            Monthly View
          </button>
        </div>

        {/* Calendar Component */}
        <Calendar view={view} />
      </div>
    </div>
  );
}

export default Recommendations;
