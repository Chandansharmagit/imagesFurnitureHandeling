import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './App.css';
import Searchquery from './searchqueryai/Searchquery';
import ImageUpload from './uploading/uplaoding';
import Navbar from './navbar/navbar';
import Products from './productspage/products';
import Headers from './headers/headers';
import ContactUs from './Contactus/contactus';
import ImageGallery from './fordeletionimage/DeletionImage';
import CustomerFurnitureDetail from './customerfurnitureproductDetails/CustomerFunrituerDetail';
import FurnitureOrderDetails from './customerfurnitureproductDetails/gettingorder'
import ProductManagement from './customerfurnitureproductDetails/ProductManagement';
import DailyExpenses from './daytodaylifeexpanses/dayinlifeexpanses';
import AdminDashboard from './admin-dashboard/admin-dashboard';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');

  const checkAdminAuth = (username, password) => {
    if (username === "admin" && password === "admin@#") {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials!');
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    
    useEffect(() => {
      if (!isAuthenticated && location.pathname === '/admin-dashboard') {
        setShowLoginModal(true);
      }
    }, [location]);

    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }

    return children;
  };

  const LoginModal = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      checkAdminAuth(username, password);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && <div className="error-message">{loginError}</div>}
            <div className="button-group">
              <button type="submit">Login</button>
              <button type="button" onClick={() => setShowLoginModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Headers/>
      <Navbar/>
      {showLoginModal && <LoginModal />}
      <Routes>
        <Route path="/" element={<Searchquery />} />
        <Route path="/upload-image" element={<ImageUpload />} />
        <Route path="/products-page" element={<Products />} />
        <Route path="/Contact-us" element={<ContactUs />} />
        <Route 
          path="/deletion-image" 
          element={
            <ProtectedRoute>
              <ImageGallery />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Customer-products-details" 
          element={
            <ProtectedRoute>
              <CustomerFurnitureDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-details" 
          element={
            <ProtectedRoute>
              <FurnitureOrderDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-managemnt" 
          element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/daily-exp" 
          element={
            <ProtectedRoute>
              <DailyExpenses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
