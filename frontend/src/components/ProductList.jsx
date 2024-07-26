// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';
import { URL } from '../url';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Snackbar,
  Rating,
  Box,
} from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [averageRatings, setAverageRatings] = useState({});
  const { user } = useUser();

  useEffect(() => {
    fetchProducts();
    fetchAverageRatings();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URL}/api/products`);
      setProducts(response.data);
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchAverageRatings = async () => {
    try {
      const response = await axios.get(`${URL}/api/ratings-reviews/average`);
      setAverageRatings(response.data);
    } catch (error) {
      console.error('Error fetching average ratings:', error);
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const createOrder = async (product) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to place an order.' });
      return;
    }

    const quantity = quantities[product._id];
    const totalAmount = product.price * quantity;

    try {
      const response = await axios.post(`${URL}/api/orders`, {
        products: [{ product: product._id, quantity }],
        totalAmount
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSnackbar({ open: true, message: 'Order placed successfully!' });
      console.log('Order created:', response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating order. Please try again.' });
      console.error('Error creating order:', error);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to add to cart.' });
      return;
    }

    const quantity = quantities[product._id];

    try {
      const response = await axios.post(`${URL}/api/cart/add`, {
        productId: product._id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSnackbar({ open: true, message: 'Product added to cart successfully!' });
      console.log('Added to cart:', response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error adding to cart. Please try again.' });
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
                <CardMedia
                  component="img"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  image={product.image}
                  alt={product.name}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Rating
                  name={`rating-${product._id}`}
                  value={averageRatings[product._id] || 0}
                  precision={0.5}
                  readOnly
                />
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantities[product._id]}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  inputProps={{ min: 1 }}
                  margin="normal"
                  fullWidth
                />
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => createOrder(product)}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Order Now
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ backgroundColor: 'black', color: 'white' }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ProductList;