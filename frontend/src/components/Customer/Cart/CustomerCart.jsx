import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';
import { URL } from '../../../url';
import { Container, Box, List, Typography } from '@mui/material';

import Loader from '../../Loader';
import CartHeader from './CartHeader';
import CartItem from './CartItem';
import PaymentSection from './PaymentSection';
import CartTotalAndCheckout from './CartTotalAndCheckout';
import SnackbarAlert from './SnackbarAlert';

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
      fetchCart(); // Refresh cart
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
        totalAmount,
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

      await axios.delete(`${URL}/api/cart`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setCart(null);
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
  }

  if (error) return <Typography color="error">{error}</Typography>;
  if (!cart || cart.products.length === 0) return (
    <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Your cart is empty
    </Typography>
  );

  const totalAmount = cart.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <Container maxWidth="md">
      <CartHeader />
      <List>
        {cart.products.map((item) => (
          <CartItem key={item.product._id} item={item} onRemove={removeFromCart} />
        ))}
      </List>
      <PaymentSection 
        paymentOption={paymentOption} 
        paymentDetails={paymentDetails}
        onPaymentOptionChange={handlePaymentOptionChange}
        onPaymentDetailChange={handlePaymentDetailChange}
      />
      <CartTotalAndCheckout totalAmount={totalAmount} onCheckout={proceedToCheckout} />
      <SnackbarAlert snackbar={snackbar} onClose={() => setSnackbar({ ...snackbar, open: false })} />
    </Container>
  );
};

export default CustomerCart;
