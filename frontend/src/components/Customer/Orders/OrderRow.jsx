// src/components/Customer/OrderRow.jsx
import React from 'react';
import { TableRow, TableCell, Typography, Chip } from '@mui/material';

const OrderRow = ({ order }) => {
  return (
    <TableRow>
      <TableCell>{order._id}</TableCell>
      <TableCell>
        {order.products.map((item, index) => (
          <Typography key={index} variant="body2">
            {item.product.name} x {item.quantity}
          </Typography>
        ))}
      </TableCell>
      <TableCell>Ksh. {order.totalAmount.toFixed(2)}</TableCell>
      <TableCell>
        <Chip
          label={order.status}
          color={
            order.status === 'completed'
              ? 'success'
              : order.status === 'cancelled'
              ? 'error'
              : 'default'
          }
        />
      </TableCell>
      <TableCell>
        <Chip
          label={order.paymentStatus}
          color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderRow;
