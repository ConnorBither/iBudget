import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserHomePage() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve the username from localStorage (assuming it's stored there after login)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {username}</h1>  {/* Personalized welcome message */}
      <div>
        <Link to="/enter-purchases">
          <button>Enter New Purchases</button>
        </Link>
      </div>
      <div>
        <Link to="/review-purchases">
          <button>Review Purchases</button>
        </Link>
      </div>
      <div>
        <Link to="/recommendations">
          <button>See Personalized Recommendations</button>
        </Link>
      </div>
      <div>
        <Link to="/settings">
          <button>Settings</button>
        </Link>
      </div>
    </div>
  );
}

export default UserHomePage;
