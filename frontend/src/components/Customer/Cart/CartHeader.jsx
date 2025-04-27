import React from 'react';
import { Typography } from '@mui/material';

const CartHeader = () => {
  return (
    <Typography 
      variant="h4" 
      gutterBottom
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '20px', 
        marginBottom: '10px',
        backgroundColor: 'green', 
        color: 'white', 
        width: '100%', 
        padding: '10px', 
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      Your Cart
    </Typography>
  );
};

export default CartHeader;
