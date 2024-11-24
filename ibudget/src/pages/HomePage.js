import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';  // Optional: Use a CSS file to style the button
import NavBar from './NavBar';

function HomePage() {
  return (
    <div className="home-page">
      <NavBar />
      <h1 className="welcome-title">Welcome to IBudget</h1>
      <div className="main">
        <Link to="/login" className="login-button">
          Go to Login Page
        </Link>
        <br />
          New Here? 
        <Link to="/register" className="register-button">
          Register Now
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
