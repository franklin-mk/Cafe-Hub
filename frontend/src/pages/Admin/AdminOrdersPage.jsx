// src/pages/Admin/AdminOrdersPage.jsx
import React from 'react';
import AdminOrders from '../../components/Admin/AdminOrders';
import { Container } from '@mui/material';

const AdminOrdersPage = () => {
  return (
    <Container maxWidth="lg">
      <AdminOrders />
    </Container>
  );
};

export default AdminOrdersPage;