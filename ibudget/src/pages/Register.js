import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
        monthlyIncome,
      });
      setMessage('User registered successfully!');
      navigate('/login');
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  return (
    <div className="login-page">
      <div className="top-bar">
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="logo" />
        </div>
        <button className="home-button" onClick={() => navigate('/')}>
          Home
        </button>
      </div>

      <div className="main-content">
        <h1 className="sign-in-title">Sign Up</h1>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Monthly Income"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          className="input-field"
        />

        <button className="sign-in-button" onClick={handleRegister}>
          Sign Up
        </button>
        
        <p className="message">{message}</p>
        
        <p className="signup-text">
          Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
