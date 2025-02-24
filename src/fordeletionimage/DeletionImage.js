import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminDashboard from '../admin-dashboard/admin-dashboard';

const ImageGallery = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch paginated images
  const fetchImages = async (pageNumber = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/images`, {
        params: { page: pageNumber }
      });
      
      console.log('API Response:', response.data);

      const formattedImages = response.data.content.map(item => ({
        id: item.id,
        url: `https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/${item.id}`,
        text: item.title,
        description: item.description
      }));
      
      setSearchResults(prevImages => 
        pageNumber === 0 ? formattedImages : [...prevImages, ...formattedImages]
      );
      setTotalPages(response.data.totalPages);
      setCurrentPage(pageNumber);
      setSearchTitle('All Furniture');
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Sorry, unable to fetch images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Function to delete an image by ID
  const handleDelete = async (id) => {
    try {
      setDeleteError(null);
      await axios.delete(`https://fierce-depths-34281-8508ca86cafd.herokuapp.com/api/${id}`);
      // Update state to remove deleted image
      setSearchResults(prevImages => prevImages.filter(image => image.id !== id));
    } catch (err) {
      console.error('Error deleting image:', err);
      setDeleteError('Error deleting image. Please try again later.');
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  return (
    <>


    <AdminDashboard/>
    <div>
      <h2>{searchTitle}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
      {isLoading && <p>Loading...</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {searchResults.map(image => (
          <div key={image.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <img src={image.url} alt={image.text} style={{ width: '200px', height: 'auto' }} />
            <h4>{image.text}</h4>
            <p>{image.description}</p>
            <button onClick={() => handleDelete(image.id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>
              Delete Image
            </button>
          </div>
        ))}
      </div>
      {currentPage < totalPages - 1 && (
        <button 
          onClick={loadMore}
          style={{ 
            margin: '20px auto', 
            display: 'block',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load More
        </button>
      )}
    </div>
    </>
  );
};

export default ImageGallery;
