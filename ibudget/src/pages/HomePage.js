import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';  // Optional: Use a CSS file to style the button

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/login" className="login-button">
        Go to Login Page
      </Link>
      <br />
      <Link to="/register" className="register-button">
        Register New Account
      </Link>
    </div>
  );
}

export default HomePage;
