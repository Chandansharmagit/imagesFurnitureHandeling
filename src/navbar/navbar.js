import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path, e) => {
    e.preventDefault();
    // Add fade-out class to the main content
    document.body.classList.add('fade-out');
    
    // Navigate after transition
    setTimeout(() => {
      navigate(path);
      document.body.classList.remove('fade-out');
    }, 300); // Match this with your CSS transition duration
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Jay Baba Furniture Store</Link>
      </div>

      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={(e) => handleNavigation('/', e)}>Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/products-page" className="nav-link" onClick={(e) => handleNavigation('/products-page', e)}>Products</Link>
        </li>
        <li className="nav-item">
          <Link to="/upload-image" className="nav-link" onClick={(e) => handleNavigation('/upload-image', e)}>Upload Image</Link>
        </li>
        <li className="nav-item">
          <Link to="/Contact-us" className="nav-link" onClick={(e) => handleNavigation('/Contact-us', e)}>Contact</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-dashboard" className="nav-link" onClick={(e) => handleNavigation('/admin-dashboard', e)}>admin dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
