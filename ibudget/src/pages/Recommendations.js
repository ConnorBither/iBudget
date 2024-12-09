// Recommendations.js
import logo from './logo.png';
import React, { useEffect, useState } from 'react';
import './LoginPage.css'; // Reusing the existing CSS for consistency
import './Recommendations.css'; // Custom CSS for additional styling
import NavBar from './NavBar';
import axios from 'axios';

function Recommendations() {
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  // Assume username is stored in localStorage after login
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recommendations', {
          params: { username },
        });
        setRecommendations(response.data.recommendations[0]); // Expecting the first recommendation object
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again later.');
      }
    };

    if (username) {
      fetchRecommendations();
    } else {
      setError('User not logged in.');
    }
  }, [username]);

  return (
    <div className="login-page">
      <NavBar />
      <div className="main-content">
        <h1 className="sign-in-title">Your Budgeting Recommendations</h1>

        {error ? (
          <div className="error-message">{error}</div>
        ) : recommendations ? (
          <div className="recommendations-container">
            <div className="recommendation-card">
              <h2>Spending Limit</h2>
              <p>${recommendations.spending_limit.toFixed(2)}</p>
            </div>
            <div className="recommendation-card">
              <h2>Saving Goal</h2>
              <p>${recommendations.saving_goal.toFixed(2)}</p>
            </div>
            <div className="recommendation-card">
              <h2>Tips for Saving</h2>
              <ul>
                {recommendations.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading recommendations...</p>
        )}
      </div>
    </div>
  );
}

export default Recommendations;