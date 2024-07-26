//src/components/Admin/AdminHome.jsx
import React from 'react'
import {  
    Container, 
    Typography, 
    Box
} from '@mui/material';
  
import AdminProductList from './AdminProducts';
import Navbar from '../Navbar'
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
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography component="h1" variant="h5">
                Welcome, Admin {user.name}!
              </Typography>
            </Box>
          </Container>

        <AdminProductList />
        
        <Footer />
    </div>
  )
}

export default AdminHome