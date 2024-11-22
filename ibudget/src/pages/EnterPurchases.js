import React from 'react';
import NewPurchases from './NewPurchases'; // Import the NewPurchases component
import NavBar from './NavBar';
import './LoginPage.css';

function EnterPurchases() {
  return (
    <div>
      <NavBar />
      <h1 className="page-title">Enter New Purchases Here</h1>
      {/* Render the NewPurchases form here */}
      <NewPurchases />
    </div>
  );
}

export default EnterPurchases;
