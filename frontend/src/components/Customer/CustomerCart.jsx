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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Loader from '../Loader';

const CustomerCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [paymentOption, setPaymentOption] = useState('mpesa');
  const [paymentDetails, setPaymentDetails] = useState({ phoneNumber: '', accountNumber: '' });
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
    if ((paymentOption === 'mpesa' && !paymentDetails.phoneNumber) || (paymentOption === 'bank' && !paymentDetails.accountNumber)) {
      setSnackbar({ open: true, message: 'Please provide payment details.' });
      return;
    }

    try {
      const orderData = {
        products: cart.products.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        status: 'processing',
        paymentStatus: 'paid',
        paymentOption,
        paymentDetails
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
      setSnackbar({ open: true, message: 'Order placed successfully! Waiting for verification.' });
      console.error('Error creating order:', error);
    }
  };

  const handlePaymentOptionChange = (event) => {
    setPaymentOption(event.target.value);
    setPaymentDetails({ phoneNumber: '', accountNumber: '' });
  };

  const handlePaymentDetailChange = (event) => {
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [event.target.name]: event.target.value
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </Box>
    );
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!cart || cart.products.length === 0) return <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Your cart is empty</Typography>;

  const totalAmount = cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <Container maxWidth="md">
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginTop: '20px', 
          marginBottom: '10px',
          backgroundColor: 'blue', 
          color: 'white', 
          width: '100%', 
          padding: '10px', 
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        Your Cart
      </Typography>
      <List>
        {cart.products.map((item) => (
          <React.Fragment key={item.product._id}>
            <ListItem>
              <ListItemText
                primary={item.product.name}
                secondary={`Quantity: ${item.quantity} - Price: Ksh. ${(item.product.price * item.quantity).toFixed(2)}`}
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
        <Typography variant="h6">Total: Ksh. {totalAmount.toFixed(2)}</Typography>

        {/* Payment Option */}
        <Box mt={2}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Payment Option</FormLabel>
            <RadioGroup
              aria-label="payment option"
              name="paymentOption"
              value={paymentOption}
              onChange={handlePaymentOptionChange}
            >
              <FormControlLabel value="mpesa" control={<Radio />} label="M-PESA" />
              <FormControlLabel value="bank" control={<Radio />} label="Bank Account" />
            </RadioGroup>
          </FormControl>

          {paymentOption === 'mpesa' && (
            <TextField
              name="phoneNumber"
              label="M-PESA Phone Number"
              variant="outlined"
              fullWidth
              value={paymentDetails.phoneNumber}
              onChange={handlePaymentDetailChange}
              sx={{ mt: 2 }}
            />
          )}

          {paymentOption === 'bank' && (
            <TextField
              name="accountNumber"
              label="Bank Account Number"
              variant="outlined"
              fullWidth
              value={paymentDetails.accountNumber}
              onChange={handlePaymentDetailChange}
              sx={{ mt: 2 }}
            />
          )}
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={proceedToCheckout}
          sx={{ mt: 2 }}
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
