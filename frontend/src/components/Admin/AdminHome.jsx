// src/components/Admin/AdminHome.jsx
import React from 'react';
import {  
    Container, 
    Typography, 
    Box
} from '@mui/material';
  
import AdminProductList from './AdminProducts';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useUser } from '../../contexts/UserContext';

const AdminHome = () => {
  const { user } = useUser();

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div>
      <Navbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            component="h1" 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#4caf50', 
              padding: 2, 
              borderRadius: 1, 
              backgroundColor: '#f0f4c3', 
              textAlign: 'center' 
            }}
          >
            Welcome, {user.name}!
          </Typography>
        </Box>
      </Container>
      <AdminProductList />
      <Footer />
    </div>
  );
};

export default AdminHome;
