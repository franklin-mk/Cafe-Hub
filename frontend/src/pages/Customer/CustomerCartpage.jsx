// src/pages/Customer/CustomerCartPage.jsx
import React from 'react';
import CustomerCart from '../../components/Customer/CustomerCart';
import { Container } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CustomerCartPage = () => {
  return (
    <div>
        <Navbar />
      
    <Container maxWidth="lg">
      <CustomerCart />
    </Container>

        <Footer />
    </div>
  );
};

export default CustomerCartPage;