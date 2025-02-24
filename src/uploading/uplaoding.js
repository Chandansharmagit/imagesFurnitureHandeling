import React, { useState, useRef } from "react";
import axios from "axios";
import "./uploading.css";
import Footer from "../navbar/footer";

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [titles, setTitles] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const fileInputRef = useRef(null);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin@#") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 200) {
      setError("Maximum 200 images can be uploaded at once.");
      return;
    }
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setError("Please upload image files only.");
      return;
    }

    setSelectedImages(validFiles);
    setPreviewImages(validFiles.map((file) => URL.createObjectURL(file)));
    setTitles(new Array(validFiles.length).fill(""));
    setDescriptions(new Array(validFiles.length).fill(""));
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 200) {
      setError("Maximum 200 images can be uploaded at once.");
      return;
    }
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const resetForm = () => {
    setSelectedImages([]);
    setPreviewImages([]);
    setTitles([]);
    setDescriptions([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    if (titles.some((title) => !title.trim())) {
      setError("Please enter titles for all images.");
      return;
    }

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    selectedImages.forEach((file, index) => {
      formData.append("files", file);
      formData.append("titles", titles[index]);
      formData.append("descriptions", descriptions[index]);
    });

    try {
      await axios.post("https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/uploadMultiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage(`${selectedImages.length} images uploaded successfully!`);
      resetForm();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError("Failed to upload images. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="upload-container">
        {successMessage && <div className="success-message">{successMessage}</div>}

        {!isAuthenticated ? (
          <div className="login-section">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className="upload-section">
            <div
              className={`drop-zone ${isDragging ? "dragging" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-content">
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Drag & Drop your images here or click to browse</p>
                <button className="browse-button">Browse Files</button>
                <p className="file-support-text">Supports: JPG, PNG, GIF (Max 5MB)</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                style={{ display: "none" }}
              />
            </div>

            {previewImages.length > 0 && (
              <div className="preview-section">
                {previewImages.map((preview, index) => (
                  <div key={index} className="image-item">
                    <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder={`Enter title for image ${index + 1}`}
                        value={titles[index]}
                        onChange={(e) => {
                          const newTitles = [...titles];
                          newTitles[index] = e.target.value;
                          setTitles(newTitles);
                        }}
                        className="input-field"
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        placeholder={`Enter description for image ${index + 1}`}
                        value={descriptions[index]}
                        onChange={(e) => {
                          const newDescriptions = [...descriptions];
                          newDescriptions[index] = e.target.value;
                          setDescriptions(newDescriptions);
                        }}
                        className="input-field textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="upload-button"
                >
                  {isUploading ? "Uploading..." : `Upload ${selectedImages.length} Images to Gallery`}
                </button>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ImageUpload;
