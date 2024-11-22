import React from 'react';
import NewPurchases from './NewPurchases'; // Import the NewPurchases component
import NavBar from './NavBar';
import './LoginPage.css';

function EnterPurchases() {
  return (
    <div>
      <NavBar />
      {/* Render the NewPurchases form here */}
      <NewPurchases />
    </div>
  );
}

export default EnterPurchases;
