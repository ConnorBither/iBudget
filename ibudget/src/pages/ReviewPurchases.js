import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Reuse the same CSS for consistent styling
import logo from './logo.png';

function ReviewPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [message, setMessage] = useState('');

  const username = localStorage.getItem('username'); // username is stored in local storage

  const fetchPurchases = useCallback(async (append = false) => {
    try {
      const response = await axios.get('http://localhost:5000/purchases', {
        params: {
          username,
          lastKey,
        },
      });
      
      // Update purchases without duplicating entries
      setPurchases((prevPurchases) =>
        append ? [...prevPurchases, ...response.data.purchases] : response.data.purchases
      );
      setLastKey(response.data.lastKey);
    } catch (error) {
      setMessage('Error fetching purchases');
    }
  }, [username, lastKey]);

  useEffect(() => {
    fetchPurchases(); // Initial load
  }, [fetchPurchases]);

  return (
    <div className="login-page">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <button className="home-button" onClick={() => window.location.href = '/'}>
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="welcome-message">Review Your Purchases</h1>
        {message && <p className="message">{message}</p>}
        <ul className="purchase-list">
          {purchases.length > 0 ? (
            purchases.map((purchase) => (
              <li key={purchase.purchaseId} className="purchase-item">
                <strong>{purchase.quantity} x {purchase.itemName}</strong> from <em>{purchase.storeName}</em> at ${purchase.price} [{purchase.category}]
              </li>
            ))
          ) : (
            <p className="message">No purchases to display</p>
          )}
        </ul>
        {lastKey && (
          <button className="home-action-button" onClick={() => fetchPurchases(true)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default ReviewPurchases;

