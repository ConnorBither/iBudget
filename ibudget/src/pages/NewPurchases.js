import React, { useState } from 'react';

function NewPurchases() {
  // State variables to store purchase details
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  // Handler for submitting the purchase data
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!itemName || !price || !quantity) {
      setMessage('Please fill in all fields.');
      return;
    }

    // Display a message for now (later, send this data to a server)
    setMessage(`Purchase added: ${quantity} x ${itemName} @ $${price}`);
    
    // Clear form
    setItemName('');
    setPrice('');
    setQuantity('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name: </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
          />
        </div>
        <div>
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
        </div>
        <div>
          <label>Quantity: </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
        </div>
        <br />
        <button type="submit">Submit Purchase</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default NewPurchases;
