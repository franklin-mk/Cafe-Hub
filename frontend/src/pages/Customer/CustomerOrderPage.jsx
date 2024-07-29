import React from 'react';
import CustomerOrders from '../../components/Customer/CustomerOrders';
import { Container, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CustomerOrderPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Container maxWidth="lg">
          <CustomerOrders />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default CustomerOrderPage;
