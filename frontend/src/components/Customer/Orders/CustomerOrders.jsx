// src/components/Customer/CustomerOrders.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import Loader from '../../Loader';
import axios from 'axios';
import { URL } from '../../../url';
import OrdersTable from './OrdersTable';
import { Box, Typography } from '@mui/material';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${URL}/api/orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ margin: 2 }}>
      <Typography 
        variant="h4"
        gutterBottom
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          marginBottom: '10px',
          backgroundColor: 'GREEN',
          color: 'white',
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      >
        Your Orders
      </Typography>

      <OrdersTable orders={orders} />
    </Box>
  );
};

export default CustomerOrders;
