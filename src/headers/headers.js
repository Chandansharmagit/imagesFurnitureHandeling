import React, { useEffect, useState } from 'react';
import './headers.css';

const Headers = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`header-strip ${isVisible ? 'visible' : 'hidden'}`}>
      Visit our <a href="https://woodenfurniture.nepalmodelsecondaryschool.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="styled-link">
        main website
      </a> for our complete collection of wooden furniture
    </div>
  );
};

export default Headers;
