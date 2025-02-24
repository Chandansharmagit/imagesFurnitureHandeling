import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mangement.css'; // We can reuse some styles
import AdminDashboard from '../admin-dashboard/admin-dashboard';

const ProductManagement = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ message: '', error: false });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/images/furniture');
      const productsWithImageUrls = {
        ...response.data,
        content: response.data.content.map(product => ({
          ...product,
          imageUrl: `https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/furniture/${product.id}`
        }))
      };
      setProducts(productsWithImageUrls);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/deleting-furniture-orders-details/${productId}`);
        setDeleteStatus({ message: 'Product deleted successfully', error: false });
        fetchProducts(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
        setDeleteStatus({ message: 'Failed to delete product', error: true });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!products || !products.content) return <div>No products found</div>;

  return (
    <>
    <AdminDashboard/>
   
    <div className="furn-products-container">
      {deleteStatus.message && (
        <div className={`furn-status-message ${deleteStatus.error ? 'error' : 'success'}`}>
          {deleteStatus.message}
        </div>
      )}

      {expandedImage && (
        <div className="modal" onClick={() => setExpandedImage(null)}>
          <img 
            src={expandedImage} 
            alt="Expanded furniture" 
            className="modal-image"
          />
        </div>
      )}
      
      <div className="furn-products-grid">
        {products.content.map((product) => (
          <div key={product.id} className="furn-product-card">
            <div className="furn-image-container">
              <img 
                src={product.imageUrl} 
                alt="Furniture" 
                className="furn-clickable-image"
                onClick={() => setExpandedImage(product.imageUrl)}
              />
            </div>

            <div className="furn-product-details">
              <h3>Product ID: {product.id}</h3>
              <p>Start Date: {new Date(product.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(product.endDate).toLocaleDateString()}</p>
              
              <div className="tasks-section">
                <h4>Tasks:</h4>
                <div className="tasks-container">
                  {product.tasks && product.tasks.map((task, index) => (
                    <span key={index} className="task-chip">{task}</span>
                  ))}
                </div>
              </div>

              <div className="payment-info">
                <p>Total Amount: ₹{product.totalAmount}</p>
                <p>Advance Payment: ₹{product.advancePayment}</p>
                <p>Remaining: ₹{product.remainingPayment}</p>
              </div>

              <button 
                className="furn-delete-button"
                onClick={() => handleDelete(product.id)}
              >
                <span className="furn-delete-icon">🗑️</span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ProductManagement; 