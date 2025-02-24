import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer" style={{ margin: 0 }}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>We specialize in creating beautiful furniture for your home.</p>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: dpworldsharma@gmail.com</p>
          <p>Phone: 9845427041</p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Furniture Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
