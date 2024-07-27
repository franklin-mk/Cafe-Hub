// src/components/Admin/AdminReview.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../../url';
import {
  Typography,
  TextField,
  Card,
  CardContent,
  Grid,
  Rating,
} from '@mui/material';

const AdminReview = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reviews, setReviews] = useState([]);

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
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
    fetchReviews(event.target.value);
  };

  return (
    <div>
      <Typography variant="h4" 
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
        }}>
        Admin Review Management
      </Typography>
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

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Product Reviews
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review) => (
          <Grid item xs={12} key={review._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{review.customer.name}</Typography>
                <Rating name={`rating-${review._id}`} value={review.rating} readOnly />
                <Typography variant="body1">{review.review}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminReview;