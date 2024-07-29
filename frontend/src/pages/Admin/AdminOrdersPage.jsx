import React from 'react';
import AdminOrders from '../../components/Admin/AdminOrders';
import { Container, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AdminOrdersPage = () => {
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
          <AdminOrders />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminOrdersPage;
