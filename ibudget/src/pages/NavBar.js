import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logo from './logo.png';

function NavBar() {
    const navigate = useNavigate();
    return (
        <div className="top-bar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <button className="home-button" onClick={() => navigate('/user-home')}>
                Home
            </button>
        </div>
    );
}

export default NavBar;
