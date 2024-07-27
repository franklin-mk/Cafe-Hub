//src/components/Customer/HomePage.jsx
import React from 'react'
import {  
    Container, 
    Typography, 
    Box
} from '@mui/material';
  
import ProductList from '../ProductList'
import Navbar from '../Navbar'
import Footer from '../Footer';
import { useUser } from '../../contexts/UserContext';

const HomePage = () => {
  const { user } = useUser();

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <div> 
      <Navbar />
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      <ProductList />
      <Footer />
    </div>
  )
}

export default HomePage