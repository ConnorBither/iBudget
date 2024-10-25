import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Store Name: </label>
          <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Enter store name" />
        </div>
        <div>
          <label>Item Name: </label>
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" />
        </div>
        <div>
          <label>Price: </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />
        </div>
        <div>
          <label>Quantity: </label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" />
        </div>
        <div>
          <label>Category: </label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter category" />
        </div>
        <br />
        <button type="submit">Submit Purchase</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default NewPurchases;
