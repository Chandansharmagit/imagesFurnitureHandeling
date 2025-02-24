import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="admin-navbar">
      <div 
        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </div>
      <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <Link to="/deletion-image" className="nav-link">deletion image</Link>
        </li>
        <li className="nav-item">
          <Link to="/Customer-products-details" className="nav-link">Customer products details</Link>
        </li>
        <li className="nav-item">
          <Link to="/order-details" className="nav-link">order details</Link>
        </li>
        <li className="nav-item">
          <Link to="/order-managemnt" className="nav-link">order managemnt</Link>
        </li>
        <li className="nav-item">
          <Link to="/daily-exp" className="nav-link">daily exp</Link>
        </li>
      
      </ul>
    </nav>
  );
};

export default AdminDashboard;
