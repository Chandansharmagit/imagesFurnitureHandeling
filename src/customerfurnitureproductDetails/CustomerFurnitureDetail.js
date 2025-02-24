import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerFurnitureDetail = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [advancePayment, setAdvancePayment] = useState('');
  const [remainingPayment, setRemainingPayment] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validateDates = () => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) > new Date(startDate);
  };

  useEffect(() => {
    const advance = Math.max(0, Number(advancePayment) || 0);
    const total = Math.max(0, Number(totalAmount) || 0);
    setRemainingPayment((total - advance).toFixed(2));
  }, [advancePayment, totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      alert("End date must be after start date");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("tasks", tasks.join(","));
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("totalAmount", totalAmount);
      formData.append("advancePayment", advancePayment);

      const response = await axios.post("https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert("Details saved successfully!");
    } catch (error) {
      alert("Error saving details: " + (error.response?.data?.message || error.message));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div>
      {/* Render your component content here */}
    </div>
  );
};

export default CustomerFurnitureDetail; 