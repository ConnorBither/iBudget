import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginPage.css';

function Settings({ username }) {
  const [email, setEmail] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current user data on component mount
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user-data?username=${username}`);
        setEmail(response.data.email);
        setMonthlyIncome(response.data.monthlyIncome);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Failed to load user data');
      }
    };
    fetchUserData();
  }, [username]);

  const handleUpdate = async () => {
    if (newPassword && newPassword !== confirmNewPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await axios.put('http://localhost:5000/update-user', {
        username,
        email,
        monthlyIncome,
        newPassword,
      });
      setMessage('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
      setMessage('Failed to update user data');
    }
  };

  return (
    <div className="login-page">
      <div className="top-bar">
        <div className="logo-container">
          <img src="logo.png" alt="Logo" className="logo" />
        </div>
        <button className="home-button">Home</button>
      </div>

      <div className="main-content">
        <h1 className="sign-in-title">Settings</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Monthly Income"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="input-field"
        />

        <button className="sign-in-button" onClick={handleUpdate}>
          Update
        </button>

        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default Settings;
