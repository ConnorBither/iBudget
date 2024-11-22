import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logo from './logo.png';
import NavBar from './NavBar';

function Settings() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    //fetch username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setMessage('No username found. Please log in.');
      return;
    }
    // Fetch current user data on component mount
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user-data?username=${username}`);
        console.log("Fetched user data:", response.data); // Check if data is received
        setEmail(response.data.email);
        setMonthlyIncome(response.data.monthlyIncome);
        setMessage(''); // Clear any previous error messages
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
      <NavBar />

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
