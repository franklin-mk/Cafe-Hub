import React from 'react';
import { Snackbar } from '@mui/material';

const SnackbarAlert = ({ snackbar, setSnackbar }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={6000}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    message={snackbar.message}
  />
);

export default SnackbarAlert;
