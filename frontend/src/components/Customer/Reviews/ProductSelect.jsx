import React from 'react';
import { TextField } from '@mui/material';

const ProductSelect = ({ products, selectedProduct, handleChange }) => (
  <TextField
    select
    label="Select Product"
    value={selectedProduct}
    onChange={handleChange}
    fullWidth
    margin="normal"
    SelectProps={{ native: true }}
  >
    <option value="">Select a product</option>
    {products.map((product) => (
      <option key={product._id} value={product._id}>
        {product.name}
      </option>
    ))}
  </TextField>
);

export default ProductSelect;
