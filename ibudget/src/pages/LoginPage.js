import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      localStorage.setItem('username', response.data.username);
      setMessage(response.data.message);
      navigate('/user-home');
    } catch (error) {
      setMessage('Invalid credentials');
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
        <h1 className="sign-in-title">Sign In</h1>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button className="sign-in-button" onClick={handleLogin}>
          Sign In
        </button>
        
        <p className="message">{message}</p>
        
        <p className="signup-text">
          Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
