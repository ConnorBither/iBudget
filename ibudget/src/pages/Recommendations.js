import React from 'react';
import './LoginPage.css'; // Reusing the existing CSS for consistency
import './Recommendations.css'; // Custom CSS for additional styling
import logo from './logo.png';
import NavBar from './NavBar';

function Recommendations() {
  const recommendations = [
    "Cut down on dining out to save $50 per month.",
    "Switch to a cheaper phone plan to save $20 per month.",
    "Set aside $200 for an emergency fund this month.",
  ]; // Sample recommendations will be changed by ai model, this is temp

  return (
    <div className="login-page">
      {/* Top Bar */}
      <NavBar />

      {/* Main Content */}
      <div className="main-content">
        <h1 className="sign-in-title">Your Budgeting Recommendations</h1>

        <div className="recommendations-container">
          {recommendations.map((rec, index) => (
            <div className="recommendation-card" key={index}>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
