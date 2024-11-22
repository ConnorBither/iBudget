import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import logo from './logo.png';

function NewPurchases() {
  const [storeName, setStoreName] = useState('');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const username = localStorage.getItem('username'); // Assuming username is stored in local storage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeName || !itemName || !price || !quantity || !category) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/add-purchase', {
        username,
        storeName,
        itemName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
      });

      setMessage('Purchase added successfully!');
      setStoreName('');
      setItemName('');
      setPrice('');
      setQuantity('');
      setCategory('');
    } catch (error) {
      setMessage('Error adding purchase');
    }
  };

  return (
    <div className="login-page">
    <div className="main-content">
    <h1 className="sign-in-title">New Purchase</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Enter store name" className="input-field" />
        </div>
        <div>
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" className="input-field" />
        </div>
        <div>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" className="input-field" />
        </div>
        <div>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" className="input-field" />
        </div>
        <div>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter category" className="input-field" />
        </div>
        <button type="submit" className="purch-action-button">Submit Purchase</button>
      </form>
      <p>{message}</p>
    </div>
    </div>
  );
}

export default NewPurchases;
