import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item, onRemove }) => {
  return (
    <>
      <ListItem>
        <ListItemText
          primary={item.product.name}
          secondary={`Quantity: ${item.quantity} - Price: Ksh. ${(item.product.price * item.quantity).toFixed(2)}`}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={() => onRemove(item.product._id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};

export default CartItem;
