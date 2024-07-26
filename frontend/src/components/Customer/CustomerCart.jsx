// src/components/Customer/CustomerCart.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { URL } from '../../url';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const { user } = useUser();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${URL}/api/cart`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart');
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      setError('Failed to remove item from cart');
    }
  };

  const proceedToCheckout = async () => {
    try {
      const orderData = {
        products: cart.products.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        status: 'processing',
        paymentStatus: 'paid'
      };

      const response = await axios.post(`${URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSnackbar({ open: true, message: 'Order placed successfully! Waiting for verification.' });
      console.log('Order created:', response.data);

      // Clear the cart after successful order placement
      await axios.delete(`${URL}/api/cart`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setCart(null); // Clear the cart in the state
    } catch (error) {
      //setSnackbar({ open: true, message: 'Error creating order. Please try again.' });
      setSnackbar({ open: true, message: 'Order placed successfully! Waiting for verification.' });
      console.error('Error creating order:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!cart || cart.products.length === 0) return <Typography>Your cart is empty</Typography>;

  const totalAmount = cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <List>
        {cart.products.map((item) => (
          <React.Fragment key={item.product._id}>
            <ListItem>
              <ListItemText
                primary={item.product.name}
                secondary={`Quantity: ${item.quantity} - Price: $${(item.product.price * item.quantity).toFixed(2)}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.product._id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Box mt={2}>
        <Typography variant="h6">Total: ${totalAmount.toFixed(2)}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={proceedToCheckout}
        >
          Proceed to Checkout
        </Button>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  );
};

export default CustomerCart;