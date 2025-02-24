import React, { useState } from 'react';
import axios from 'axios';
import './contactus.css';
import Footer from '../navbar/footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <>
   
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Our team is always here to help.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-box">
            <h3>Customer Support</h3>
            <p>24/7 dedicated support</p>
            <p>📞 +1 (555) 123-4567</p>
            <p>✉️ support@yourfurniture.com</p>
          </div>

          <div className="trust-indicators">
            <div className="trust-item">
              <h4>💫 100% Satisfaction Guarantee</h4>
              <p>Your satisfaction is our top priority</p>
            </div>
            <div className="trust-item">
              <h4>🛡️ Secure Communication</h4>
              <p>Your information is always protected</p>
            </div>
            <div className="trust-item">
              <h4>⚡ Quick Response Time</h4>
              <p>We typically respond within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>

            {submitStatus === 'success' && (
              <div className="success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="error-message">
                Something went wrong. Please try again later.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="business-hours">
        <h3>Business Hours</h3>
        <div className="hours-grid">
          <div>Monday - Friday</div>
          <div>9:00 AM - 6:00 PM</div>
          <div>Saturday</div>
          <div>10:00 AM - 4:00 PM</div>
          <div>Sunday</div>
          <div>Closed</div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ContactUs;
