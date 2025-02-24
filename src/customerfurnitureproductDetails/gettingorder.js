import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './gettingorder.css';
import AdminDashboard from '../admin-dashboard/admin-dashboard';

const FurnitureOrderDetails = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/images/furniture');
        
        // Map the response data to include the correct image URL
        const ordersWithImageUrls = {
          ...response.data,
          content: response.data.content.map(order => ({
            ...order,
            imageUrl: `https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/furniture/${order.id}`
          }))
        };
        
        setOrdersData(ordersWithImageUrls);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!ordersData || !ordersData.content) return <div>No orders found</div>;

  return (
    <>
    <AdminDashboard/>

    <div className="orders-container">
      {expandedImage && (
        <div className="modal" onClick={() => setExpandedImage(null)}>
          <img 
            src={expandedImage} 
            alt="Expanded furniture" 
            className="modal-image"
          />
        </div>
      )}
      
      {ordersData.content.map((orderData) => {
        const paymentProgress = (orderData.advancePayment / orderData.totalAmount) * 100;
        
        return (
          <div key={orderData.id} className="order-card">
            <div className="image-container">
              <img 
                src={orderData.imageUrl} 
                alt="Furniture" 
                onClick={() => setExpandedImage(orderData.imageUrl)}
                className="clickable-image"
              />
            </div>

            <div className="card-content">
              <h2>Order Details</h2>
              <p>ID: {orderData.id}</p>

              <div className="date-section">
                <p>
                  {new Date(orderData.startDate).toLocaleDateString()} - 
                  {new Date(orderData.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="tasks-section">
                <h3>Tasks</h3>
                <div className="tasks-container">
                  {orderData.tasks && orderData.tasks.map((task, index) => (
                    <span key={index} className="task-chip">{task}</span>
                  ))}
                </div>
              </div>

              <hr />

              <div className="payment-section">
                <h3>Payment Details</h3>
                
                <div className="payment-grid">
                  <div className="payment-item">
                    <p>Total Amount</p>
                    <h4>₹{orderData.totalAmount}</h4>
                  </div>
                  <div className="payment-item">
                    <p>Advance Paid</p>
                    <h4>₹{orderData.advancePayment}</h4>
                  </div>
                  <div className="payment-item">
                    <p>Remaining</p>
                    <h4>₹{orderData.remainingPayment}</h4>
                  </div>
                </div>

                <div className="progress-section">
                  <p>Payment Progress</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${paymentProgress}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">{paymentProgress.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </>
  );
};

export default FurnitureOrderDetails;
