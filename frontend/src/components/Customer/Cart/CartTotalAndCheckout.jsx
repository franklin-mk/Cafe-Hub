import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const CartTotalAndCheckout = ({ totalAmount, onCheckout }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6">Total: Ksh. {totalAmount.toFixed(2)}</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={onCheckout}
        sx={{ mt: 2 }}
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default CartTotalAndCheckout;
