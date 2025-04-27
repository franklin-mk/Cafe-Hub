import React from 'react';
import CustomerReview from '../../components/Customer/Reviews/CustomerReview';
import { Container, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CustomerReviewPage = () => {
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
          <CustomerReview />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default CustomerReviewPage;
