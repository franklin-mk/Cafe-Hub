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
            <Typography component="h1" variant="h5">
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