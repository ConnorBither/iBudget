import React, { useState } from 'react';
import axios from 'axios';
import './NewPurchases.css';

function NewPurchases() {
  const [storeName, setStoreName] = useState('');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [storeLocation, setStoreLocation] = useState('');
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState('');

  const username = localStorage.getItem('username');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeName || !itemName || !price || !quantity || !category || !paymentMethod || !transactionDate || !storeLocation || discount === '') {
      setMessage('Please fill in all fields.');
      return;
    }

    const totalAmount = parseFloat(price) * parseInt(quantity);
    const purchaseId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const productId = itemName; // Automatically set productId as the itemName

    try {
      await axios.post('http://localhost:5000/add-purchase', {
        username,
        purchaseId,
        itemName,
        storeName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        paymentMethod,
        transactionDate,
        storeLocation,
        discount: parseFloat(discount),
        totalAmount,
      });

      setMessage('Purchase added successfully!');
      setStoreName('');
      setItemName('');
      setPrice('');
      setQuantity('');
      setCategory('');
      setPaymentMethod('');
      setTransactionDate('');
      setStoreLocation('');
      setDiscount('');
    } catch (error) {
      setMessage('Error adding purchase');
    }
  };

  return (
    <div className="back">
      <div className="new-purchase-page">
        <form onSubmit={handleSubmit}>
          <div><input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Enter store name" className="input-field" /></div>
          <div><input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" className="input-field" /></div>
          <div><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" className="input-field" /></div>
          <div><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" className="input-field" /></div>
          <div><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter category" className="input-field" /></div>
          <div><input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Enter payment method" className="input-field" /></div>
          <div><input type="datetime-local" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} placeholder="Enter transaction date" className="input-field" /></div>
          <div><input type="text" value={storeLocation} onChange={(e) => setStoreLocation(e.target.value)} placeholder="Enter store location" className="input-field" /></div>
          <div><input type="number" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Enter discount (%)" className="input-field" /></div>
          <button type="submit" className="action-button">Submit Purchase</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default NewPurchases;
