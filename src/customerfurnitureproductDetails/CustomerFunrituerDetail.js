import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CustomerFurnitureDetail.css";
import { jsPDF } from "jspdf";
import AdminDashboard from "../admin-dashboard/admin-dashboard";

function CustomerFurnitureDetail() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [signature, setSignature] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [remainingPayment, setRemainingPayment] = useState("");

  // Automatically calculate remaining payment
  useEffect(() => {
    const advance = parseFloat(advancePayment) || 0;
    const total = parseFloat(totalAmount) || 0;
    setRemainingPayment(Math.max(0, total - advance).toFixed(2));
  }, [advancePayment, totalAmount]);

  // Update the useEffect for total calculation
  useEffect(() => {
    const calculateTotalFromTasks = () => {
      const total = tasks.reduce((sum, task) => {
        // Look for numbers after the last '=' sign
        const parts = task.split('=');
        if (parts.length > 1) {
          const lastPart = parts[parts.length - 1].trim();
          const number = parseFloat(lastPart);
          return sum + (isNaN(number) ? 0 : number);
        }
        return sum;
      }, 0);
      
      console.log('Tasks:', tasks); // Debug log
      console.log('Calculated Total:', total); // Debug log
      setTotalAmount(total.toFixed(2));
    };

    calculateTotalFromTasks();
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      // Only add the task if it contains a calculation result
      if (newTask.includes('=')) {
        setTasks([...tasks, newTask]);
        setNewTask("");
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === '=') {
      e.preventDefault();
      const parts = newTask.split(':');
      if (parts.length === 2) {
        const description = parts[0].trim();
        const calculation = parts[1].trim();
        try {
          // eslint-disable-next-line no-eval
          const result = eval(calculation);
          const formattedResult = Number(result).toFixed(2); // Format to 2 decimal places
          const finalTask = `${description}: ${calculation} = ${formattedResult}`;
          setNewTask(finalTask);
        } catch (error) {
          // Remove setCalculationResult line
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("tasks", tasks.join(","));
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("totalAmount", totalAmount);
      formData.append("advancePayment", advancePayment);
      formData.append("signature", signature);

      const response = await axios.post(
        "https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/uploadFurnitureDetails", 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 60000, // 60 seconds timeout
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );
      console.log("Saved detail:", response.data);
      // Handle success (e.g., notify user, reset state, etc.)
    } catch (error) {
      console.error("Error saving furniture detail:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(20);
    doc.text("Jay Bisokarmababa Furniture", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Address: Sindureghari", 105, 30, { align: "center" });

    // Add content
    doc.setFontSize(14);
    doc.text("Product Details", 20, 50);
    doc.setFontSize(12);
    doc.text(`Start Date: ${startDate || "Not specified"}`, 20, 60);
    doc.text(`End Date: ${endDate || "Not specified"}`, 20, 70);

    // Add tasks
    doc.text("Tasks:", 20, 90);
    tasks.forEach((task, index) => {
      doc.text(`• ${task}`, 20, 100 + index * 10);
    });

    // Payment details
    let yPos = 100 + tasks.length * 10 + 20;
    doc.text("Payment Details:", 20, yPos);
    doc.text(`Total Amount: Rs. ${totalAmount || "0"}`, 20, yPos + 10);
    doc.text(`Advance Payment: Rs. ${advancePayment || "0"}`, 20, yPos + 20);
    doc.text(`Remaining Payment: Rs. ${remainingPayment || "0"}`, 20, yPos + 30);

    // Signature
    doc.text(`Digital Signature: ${signature || "Not signed"}`, 20, yPos + 50);

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Note: These details are final and cannot be edited or changed once submitted.", 20, yPos + 70);

    // Save the PDF
    doc.save("furniture-details.pdf");
  };

  return (
    <>
    <AdminDashboard/>

    <div className="furniture-detail-container">
      <h1>Furniture Store Product Details</h1>

      <form onSubmit={handleSubmit}>
        <div className="sections-wrapper">
          <div className="section">
            <h2>To-Do List</h2>
            <div className="form-control">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter task (e.g., Sofa: 2*2000) and press = for calculation"
              />
              
              <button type="button" onClick={handleAddTask}>
                Add Task
              </button>
            </div>
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2>Product Dates</h2>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <div className="section">
            <h2>Product Image</h2>
            <div
              className="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Product" />
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              )}
            </div>
          </div>

          <div className="section payment">
            <h2>Payment Details</h2>
            <label>
              Total Amount (Calculated from tasks):
              <input
                type="text"
                value={`Rs. ${totalAmount}`}
                readOnly
                placeholder="Auto-calculated from tasks"
              />
            </label>
            <label>
              Advance Payment:
              <input
                type="number"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(e.target.value)}
                placeholder="Enter advance payment"
              />
            </label>
            <label>
              Remaining Payment:
              <input
                type="text"
                value={remainingPayment}
                readOnly
                className="remaining-amount"
              />
            </label>
          </div>

          <div className="section signature">
            <h2>Digital Signature</h2>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter digital signature"
            />
          </div>
        </div>

        <div className="section download-pdf">
          <button type="submit" style={{ marginRight: "10px" }}>
            Submit to Backend
          </button>
          <button
            type="button"
            onClick={generatePDF}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Download PDF
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default CustomerFurnitureDetail;
