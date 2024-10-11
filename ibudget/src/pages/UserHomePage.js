import React from 'react';
import { Link } from 'react-router-dom';

function UserHomePage() {
  return (
    <div>
      <h1>User's Home Page</h1>
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