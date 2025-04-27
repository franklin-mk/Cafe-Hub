import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Fade,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductList from './Product/ProductList';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useUser } from '../../contexts/UserContext';

const HomePage = () => {
  const { user } = useUser();
  const [showWelcome, setShowWelcome] = useState(true);
  
  useEffect(() => {
    // Auto-hide welcome message after 5 seconds
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  if (!user || user.role !== 'customer') {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Welcome Popup */}
      <Fade in={showWelcome}>
        <Paper 
          elevation={6}
          sx={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            padding: 3,
            borderRadius: 2,
            maxWidth: '350px',
            backgroundColor: '#f8f9ff',
            border: '1px solid #4a6cf7',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#4a6cf7' }}>
              Welcome Back!
            </Typography>
            <IconButton size="small" onClick={handleCloseWelcome} aria-label="close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Hello, <Box component="span" sx={{ fontWeight: 'bold' }}>{user.name}</Box>! 
            We're glad to see you again.
          </Typography>
          
          <Button 
            variant="contained"
            onClick={handleCloseWelcome}
            sx={{ 
              bgcolor: '#4a6cf7', 
              '&:hover': { bgcolor: '#3a5bd9' },
              textTransform: 'none'
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Fade>
      
      {/* Main Content */}
      <Container sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4,ml:2, fontWeight: 600 }}>
          Discover Our Products
        </Typography>
        <ProductList />
      </Container>
      
      <Footer />
    </Box>
  );
};

export default HomePage;