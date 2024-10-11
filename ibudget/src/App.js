import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/LoginPage';
import UserHomePage from './pages/UserHomePage';
import EnterPurchases from './pages/EnterPurchases';
import ReviewPurchases from './pages/ReviewPurchases';
import Recommendations from './pages/Recommendations';
import Settings from './pages/Settings';
import NewPurchases from './pages/NewPurchases';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-home" element={<UserHomePage />} />
          <Route path="/enter-purchases" element={<EnterPurchases />} />
          <Route path="/review-purchases" element={<ReviewPurchases />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-purchases" element={<NewPurchases />} />
          {/* Catch-all route for any undefined paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

