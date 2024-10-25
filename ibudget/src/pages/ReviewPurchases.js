import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReviewPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [message, setMessage] = useState('');

  const username = localStorage.getItem('username'); // Assuming username is stored in local storage

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/purchases', {
        params: {
          username,
          lastKey,
        },
      });
      setPurchases(response.data.purchases);
      setLastKey(response.data.lastKey);
    } catch (error) {
      setMessage('Error fetching purchases');
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div>
      <h1>Review Purchases</h1>
      {message && <p>{message}</p>}
      <ul>
        {purchases.map((purchase) => (
          <li key={purchase.purchaseId}>
            {purchase.quantity} x {purchase.itemName} from {purchase.storeName} @ ${purchase.price} [{purchase.category}]
          </li>
        ))}
      </ul>
      {lastKey && <button onClick={fetchPurchases}>Load More</button>}
    </div>
  );
}

export default ReviewPurchases;