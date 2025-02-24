import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './products.css';
import Footer from '../navbar/footer';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://backendwoodennepal.nepalmodelsecondaryschool.com/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const getProductImages = (product) => {
    const images = [product.image1];
    if (product.image2) images.push(product.image2);
    if (product.image3) images.push(product.image3);
    return images;
  };

  const nextImage = () => {
    if (selectedProduct) {
      const images = getProductImages(selectedProduct);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      const images = getProductImages(selectedProduct);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
    
   
    <div className="products-container">
    <h1 className='products-title'>New lauched Products..</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div 
            className="product-card" 
            key={product._id}
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image-container">
              <img 
                src={`https://backendwoodennepal.nepalmodelsecondaryschool.com${product.image1}`} 
                alt={product.name} 
              />
              <div className="hover-images">
                {product.image2 && (
                  <img 
                    src={`https://backendwoodennepal.nepalmodelsecondaryschool.com${product.image2}`} 
                    alt={product.name} 
                  />
                )}
                {product.image3 && (
                  <img 
                    src={`https://backendwoodennepal.nepalmodelsecondaryschool.com${product.image3}`} 
                    alt={product.name} 
                  />
                )}
              </div>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-details">
                <p className="product-price">NPR {product.price.toLocaleString()}</p>
                <p className="product-stock">Stock: {product.stock}</p>
              </div>
              <div className="product-specs">
                <span>Dimensions: {product.dimensions}</span>
                <span>Material: {product.material}</span>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            
            <div className="modal-product-details">
              <div className="modal-images">
                {selectedProduct && (
                  <>
                    <div className="slider-container">
                      <button className="slider-btn prev" onClick={prevImage}>❮</button>
                      <img 
                        src={`https://backendwoodennepal.nepalmodelsecondaryschool.com${getProductImages(selectedProduct)[currentImageIndex]}`} 
                        alt={selectedProduct.name}
                        className="main-image"
                      />
                      <button className="slider-btn next" onClick={nextImage}>❯</button>
                    </div>
                    <div className="thumbnail-images">
                      {getProductImages(selectedProduct).map((image, index) => (
                        <img 
                          key={index}
                          src={`https://backendwoodennepal.nepalmodelsecondaryschool.com${image}`}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className={currentImageIndex === index ? 'active' : ''}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-info">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-price">NPR {selectedProduct.price.toLocaleString()}</p>
                
                <div className="product-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Dimensions:</span>
                    <span>{selectedProduct.dimensions}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Material:</span>
                    <span>{selectedProduct.material}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Color:</span>
                    <span>{selectedProduct.color}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight:</span>
                    <span>{selectedProduct.weight} kg</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Warranty:</span>
                    <span>{selectedProduct.warranty} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Stock:</span>
                    <span>{selectedProduct.stock} units</span>
                  </div>
                </div>

                <div className="description">
                  <h3>Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                <div className="contact-supplier">
                  <h3>Contact Supplier</h3>
                  <div className="contact-buttons">
                    <a href="tel:+977-9867332731" className="contact-btn phone">
                      <i className="fas fa-phone"></i> Call Now
                    </a>
                    <a href="https://wa.me/9779845427041" className="contact-btn whatsapp">
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default Products;
