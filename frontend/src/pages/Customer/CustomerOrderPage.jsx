// src/pages/Customer/CustomerOrderPage.jsx
import React from 'react';
import CustomerOrders from '../../components/Customer/CustomerOrders';
import { Container } from '@mui/material';

const CustomerOrderPage = () => {
  return (
    <Container maxWidth="lg">
      <CustomerOrders />
    </Container>
  );
};

export default CustomerOrderPage;