import React from 'react';
import { Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';

const PaymentSection = ({ paymentOption, paymentDetails, onPaymentOptionChange, onPaymentDetailChange }) => {
  return (
    <Box mt={2}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Payment Option</FormLabel>
        <RadioGroup
          aria-label="payment option"
          name="paymentOption"
          value={paymentOption}
          onChange={onPaymentOptionChange}
        >
          <FormControlLabel value="mpesa" control={<Radio />} label="M-PESA" />
          <FormControlLabel value="bank" control={<Radio />} label="Bank Account" />
        </RadioGroup>
      </FormControl>

      {paymentOption === 'mpesa' && (
        <TextField
          name="phoneNumber"
          label="M-PESA Phone Number"
          variant="outlined"
          fullWidth
          value={paymentDetails.phoneNumber}
          onChange={onPaymentDetailChange}
          sx={{ mt: 2 }}
        />
      )}

      {paymentOption === 'bank' && (
        <TextField
          name="accountNumber"
          label="Bank Account Number"
          variant="outlined"
          fullWidth
          value={paymentDetails.accountNumber}
          onChange={onPaymentDetailChange}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};

export default PaymentSection;
