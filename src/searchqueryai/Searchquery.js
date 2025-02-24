import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSomeIcon } from '@fortawesome/free-solid-svg-icons';

import './Searchquery.css';
import { 
  faMicrophone, 
  faMicrophoneSlash, 
  faImage,
  faDownload,
  faShare,
  faEllipsisVertical 
} from '@fortawesome/free-solid-svg-icons';
import Footer from '../navbar/footer';
import Loader from '../loader/loader';


const Searchquery = () => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const searchTimeoutRef = useRef(null);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [selectedDownloadItem, setSelectedDownloadItem] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState('standard');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const imageContainerStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
   
  };

  const imageContainerHoverStyle = {
    // Add your hover styles here
  };

  useEffect(() => {
    fetchAllImages(0);
  }, []);

  React.useEffect(() => {
    const preventScreenshot = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent various screenshot methods and refresh
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey || e.metaKey) && // Command or Control
        (e.shiftKey) && // Shift
        (
          e.key === 'p' || e.key === 'P' || 
          e.key === 's' || e.key === 'S' ||
          e.key === 'r' || e.key === 'R'  // Added R key prevention
        )
      ) {
        e.preventDefault();
      }
    });

    document.addEventListener('contextmenu', preventScreenshot);
    document.addEventListener('beforeprint', preventScreenshot);
    document.addEventListener('afterprint', preventScreenshot);

    return () => {
      document.removeEventListener('contextmenu', preventScreenshot);
      document.removeEventListener('beforeprint', preventScreenshot);
      document.removeEventListener('afterprint', preventScreenshot);
    };
  }, []);

  const fetchAllImages = async (pageNumber = 0) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/images`, {
        params: { page: pageNumber }
      });
      
      // Log the response to check pagination data
      console.log('API Response:', response.data);

      const formattedImages = response.data.content.map(item => ({
        id: item.id,
        url: `https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/${item.id}`,
        text: item.title,
        description: item.description
      }));

      setSearchResults(formattedImages);
      setTotalPages(response.data.totalPages); // Make sure this is being set
      setCurrentPage(pageNumber);
      console.log('Total Pages:', response.data.totalPages); // Debug log
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => setSearchText(event.results[0][0].transcript);
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSearch = async () => {
    try {
      setError(null);
      const response = await axios.get('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/search', {
        params: {
          query: searchText
        }
      });
      const formattedResults = response.data.map(item => ({
        id: item.id,
        url: `https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/${item.id}`,
        text: item.title,
        description: item.description
      }));
      setSearchResults(formattedResults);
      setSearchTitle('Search Results');
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Sorry, the search service is temporarily unavailable. Please try again later.');
      setSearchResults([]);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      handleSearch();
    }
  };

  const handleImageSearch = async (file) => {
    try {
      setError(null);
      const hash = await getFileHash(file);
      const response = await axios.get('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/search-by-hash', {
        params: {
          hash: hash
        }
      });

      setSelectedImage({
        url: URL.createObjectURL(file),
        text: 'Uploaded Image',
        description: 'Your uploaded image'
      });
      setSearchResults(response.data);
      setSearchTitle('Similar Images');
    } catch (error) {
      console.error('Error fetching image search results:', error);
      setError('Sorry, the image search service is temporarily unavailable. Please try again later.');
      setSearchResults([]);
    }
  };
  
  const getFileHash = async (file) => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', file);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return btoa(String.fromCharCode.apply(null, hashArray));
  };

  const handleGenerate = async () => {
    try {
      setError(null);
      setIsGenerating(true);
      const response = await axios.get('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/generate', {
        prompt: searchText
      });
      setSearchResults(response.data);
      setSearchTitle('AI Generated Results');
    } catch (error) {
      console.error('Error generating results:', error);
      setError('Sorry, the AI generation service is temporarily unavailable. Please try again later.');
      setSearchResults([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedDownloadItem(item);
    setShowDownloadPopup(true);
  };



  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Add payment processing logic here
    console.log('Processing payment...');
    setShowPaymentPopup(false);
    setShowDownloadPopup(false);
  };

  return (
    <>
    
    <div className="page-container">
      <div className="hero-section">
        <h1>{searchTitle || 'Discover Perfect Furniture'}</h1>
        <p className="subtitle">Search through thousands of premium furniture pieces for your home</p>
      </div>

      <div className="search-container">
        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            padding: '10px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <div className="search-bar">
          <div className="input-wrapper">
            <div className="input-row">
              <div className="user-avatar">
                <div className="avatar-circle"></div>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  className="copilot-input"
                  placeholder="Search for furniture...What types of Products you want to see?"
                  value={searchText}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="input-icons">
                <button 
                  className={`generate-button ${isGenerating ? 'generating' : ''}`}
                  onClick={handleGenerate}
                  disabled={!searchText.trim() || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
                <button 
                  className="icon-button"
                  onClick={isListening ? stopListening : startListening}
                >
                  <FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} />
                </button>
                <label className="icon-button" htmlFor="image-upload">
                  <FontAwesomeIcon icon={faImage} />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedImage(URL.createObjectURL(file));
                      handleImageSearch(file);
                    }
                  }}
                />
              </div>
            </div>
            
            {selectedImage && (
              <div className="selected-image-container">
                <div className="selected-image">
                  <img src={selectedImage.url} alt="Selected" />
                </div>
                <div className="selected-image-info">
                  <h3>{selectedImage.text}</h3>
                  <p>{selectedImage.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="gallery-section">
          <h2>Featured Collections</h2>
          <div className="category-tabs">
            <button className="category-tab active" onClick={fetchAllImages}>All</button>
            <button className="category-tab">Living Room</button>
            <button className="category-tab">Bedroom</button>
            <button className="category-tab">Dining</button>
            <button className="category-tab">Office</button>
          </div>
          
          <div className="furniture-grid">
            {searchResults.map((item) => (
              <div 
                key={item.id} 
                className="furniture-card"
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onContextMenu={(e) => e.preventDefault()}
                style={{ 
                  cursor: 'pointer', 
                  position: 'relative'
                }}
              >
                <div 
                  className="furniture-image"
                  style={{
                    ...imageContainerStyle,
                    ...(hoveredCardId === item.id ? imageContainerHoverStyle : {})
                  }}
                >
                  <img 
                    src={item.url} 
                    alt={item.text}
                    className="furniture-img"
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                    draggable="false"
                  />
                  {hoveredCardId === item.id && (
                    <div className="hover-icons">
                      <button 
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add your menu logic here
                        }}
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                      <button 
                        className="icon-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add your share logic here
                        }}
                      >
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                      <button 
                        className="icon-btn"
                        onClick={(e) => handleDownloadClick(e, item)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  )}
                  <div className="furniture-overlay">
                    <div className="furniture-info">
                      <h3>{item.text}</h3>
                      <p className="description">{item.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {console.log('Rendering - Current Page:', currentPage, 'Total Pages:', totalPages)}
          
          {totalPages > 0 && (
            <div className="pagination-controls">
              <button
                onClick={() => fetchAllImages(currentPage - 1)}
                disabled={currentPage === 0 || isLoading}
                className="pagination-button"
              >
                Previous
              </button>

              {isLoading ? (
                <div className="loader-container">
                  <Loader/>
                </div>
              ) : (
                [...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => fetchAllImages(index)}
                    disabled={isLoading}
                    className={`pagination-button ${currentPage === index ? 'active' : ''}`}
                  >
                    {index + 1}
                  </button>
                ))
              )}

              <button
                onClick={() => fetchAllImages(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || isLoading}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer/>

    {showDownloadPopup && selectedDownloadItem && (
      <>
        <div 
          style={{
            position: 'fixed',
            top: 20,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => setShowDownloadPopup(false)}
        >
          <div 
            className="download-popup"
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              width: '90%',
              marginTop: "70px",
              maxWidth: '900px',
              maxHeight: '75vh',
              overflowY: 'auto',
              zIndex: 999,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              msOverflowStyle: 'none',  // IE and Edge
              scrollbarWidth: 'none',    // Firefox
              '&::-webkit-scrollbar': {  // Chrome, Safari and Opera
                display: 'none'
              }
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Download Options</h2>
              <button 
                onClick={() => setShowDownloadPopup(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{ flex: '0 0 300px' }}>
                <img 
                  src={selectedDownloadItem.url}
                  alt="Preview"
                  style={{
                    width: '58.5vw',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                  className='download-image'
                />
              </div>
              
            </div>

          

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowDownloadPopup(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(`Selected ${selectedPlan} plan`);
                  setShowPaymentPopup(true);
                }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: selectedPlan ? 1 : 0.5
                }}
                disabled={!selectedPlan}
              >
                Download Now
              </button>
            </div>
          </div>
        </div>
      </>
    )}

    {showPaymentPopup && (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={() => setShowPaymentPopup(false)}
      >
        <div 
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Payment Details</h2>
            <button 
              onClick={() => setShowPaymentPopup(false)}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px'
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handlePaymentSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name on Card</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPaymentPopup(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#4CAF50',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Pay Now
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default Searchquery;
