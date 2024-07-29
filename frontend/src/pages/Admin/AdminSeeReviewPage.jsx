import React from 'react';
import AdminReview from '../../components/Admin/AdminReview';
import { Container, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AdminSeeReviewPage = () => {
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
          <AdminReview />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminSeeReviewPage;
