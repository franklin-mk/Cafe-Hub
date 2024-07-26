// src/pages/Customer/CustomerCartPage.jsx
import React from 'react';
import CustomerCart from '../../components/Customer/CustomerCart';
import { Container } from '@mui/material';

const CustomerCartPage = () => {
  return (
    <Container maxWidth="lg">
      <CustomerCart />
    </Container>
  );
};

export default CustomerCartPage;