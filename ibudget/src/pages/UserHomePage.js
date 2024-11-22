import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reuse the same CSS for styling consistency
import logo from './logo.png';
import NavBar from './NavBar';

function UserHomePage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="login-page">
      {/* Top Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="main-content">
        <h1 className="welcome-message">Welcome, {username}</h1>
        
        <div className="button-container">
          <Link to="/enter-purchases">
            <button className="home-action-button">Enter New Purchases</button>
          </Link>
          <Link to="/review-purchases">
            <button className="home-action-button">Review Purchases</button>
          </Link>
          <Link to="/recommendations">
            <button className="home-action-button">See Personalized Recommendations</button>
          </Link>
          <Link to="/settings">
            <button className="home-action-button">Settings</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;
