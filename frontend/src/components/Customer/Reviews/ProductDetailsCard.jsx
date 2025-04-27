import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating } from '@mui/material';

const ProductDetailsCard = ({ product, averageRating }) => (
  <Card>
    <CardMedia
      component="img"
      height="200"
      image={product.image}
      alt={product.name}
    />
    <CardContent>
      <Typography variant="h6">{product.name}</Typography>
      <Typography variant="body2" color="text.secondary">{product.description}</Typography>
      <Typography variant="body2" color="text.secondary">
        Average Rating: <Rating value={averageRating} precision={0.1} readOnly />
        ({averageRating.toFixed(1)})
      </Typography>
    </CardContent>
  </Card>
);

export default ProductDetailsCard;
