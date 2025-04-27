////src/components/Customer/Reviews/CustomerReview.jsx
//USE THIS IF ANY REFERENCE IS NEEDED FOR PRODUCT ID ETC
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';
import { URL } from '../../../url';
import { Typography, Grid, Box } from '@mui/material';
import ProductSelect from './ProductSelect';
import ProductDetailsCard from './ProductDetailsCard';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import SnackbarAlert from './SnackbarAlert';

const CustomerReview = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(`${URL}/api/ratings-reviews/${productId}`);
      setReviews(res.data);
      calculateAverageRating(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return setAverageRating(0);
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating(sum / reviews.length);
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    fetchReviews(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to submit a review.' });
      return;
    }
    try {
      await axios.post(`${URL}/api/ratings-reviews`, 
        { product: selectedProduct, rating, review }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSnackbar({ open: true, message: 'Review submitted successfully!' });
      fetchReviews(selectedProduct);
      setRating(0);
      setReview('');
    } catch (err) {
      console.error('Error submitting review:', err);
      setSnackbar({ open: true, message: 'Error submitting review. Please try again.' });
    }
  };

  const selectedProductData = products.find(p => p._id === selectedProduct);

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto' }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: 2,
          mb: 1,
          backgroundColor: 'GREEN', 
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        Customers Reviews
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProductSelect 
            products={products} 
            selectedProduct={selectedProduct} 
            handleChange={handleProductChange} 
          />
          <ReviewForm 
            rating={rating}
            setRating={setRating}
            review={review}
            setReview={setReview}
            handleSubmit={handleSubmit}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedProductData && (
            <ProductDetailsCard 
              product={selectedProductData}
              averageRating={averageRating}
            />
          )}
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Product Reviews
      </Typography>
      <ReviewList reviews={reviews} />

      <SnackbarAlert snackbar={snackbar} setSnackbar={setSnackbar} />
    </Box>
  );
};

export default CustomerReview;
