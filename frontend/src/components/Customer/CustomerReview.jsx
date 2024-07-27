// src/components/Customer/CustomerReview.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { URL } from '../../url';
import {
  Typography,
  TextField,
  Button,
  Rating,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Snackbar,
  Box,
  Divider,
} from '@mui/material';

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
      const response = await axios.get(`${URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const response = await axios.get(`${URL}/api/ratings-reviews/${productId}`);
      setReviews(response.data);
      calculateAverageRating(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      setAverageRating(0);
      return;
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating(sum / reviews.length);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    fetchReviews(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to submit a review.' });
      return;
    }

    try {
      await axios.post(
        `${URL}/api/ratings-reviews`,
        { product: selectedProduct, rating, review },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSnackbar({ open: true, message: 'Review submitted successfully!' });
      fetchReviews(selectedProduct);
      setRating(0);
      setReview('');
    } catch (error) {
      setSnackbar({ open: true, message: 'Error submitting review. Please try again.' });
      console.error('Error submitting review:', error);
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
          marginTop: '20px', 
          marginBottom: '10px',
          backgroundColor: 'grey', 
          color: 'white', 
          width: '100%', 
          padding: '10px', 
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        Customers Reviews
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              label="Select Product"
              value={selectedProduct}
              onChange={handleProductChange}
              fullWidth
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </TextField>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
            />
            <TextField
              label="Review"
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedProductData && (
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={selectedProductData.image}
                alt={selectedProductData.name}
              />
              <CardContent>
                <Typography variant="h6">{selectedProductData.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProductData.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating: <Rating value={averageRating} precision={0.1} readOnly />
                  ({averageRating.toFixed(1)})
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Product Reviews
      </Typography>
      <Card>
        {reviews.map((review, index) => (
          <React.Fragment key={review._id}>
            <CardContent>
              <Typography variant="h6">{review.customer.name}</Typography>
              <Rating name={`rating-${review._id}`} value={review.rating} readOnly />
              <Typography variant="body1">{review.review}</Typography>
            </CardContent>
            {index < reviews.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default CustomerReview;