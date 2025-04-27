import React from 'react';
import { Snackbar } from '@mui/material';

const SnackbarAlert = ({ snackbar, onClose }) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
      message={snackbar.message}
    />
  );
};

export default SnackbarAlert;
