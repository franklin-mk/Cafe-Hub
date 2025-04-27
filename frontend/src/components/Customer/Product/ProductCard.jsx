// src/components/Customer/Product/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Rating,
  TextField,
  Chip
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

const ProductCard = ({ 
  product, 
  quantity, 
  onQuantityChange, 
  onAddToCart, 
  onShowReviews, 
  averageRating 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          image={product.image}
          alt={product.name}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            {product.name}
          </Typography>
          <Chip 
            label={product.category} 
            sx={{ mb: 1, backgroundColor: 'grey', color: 'white' }}
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}
          </Typography>
          <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
            Ksh. {product.price.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              name={`rating-${product._id}`}
              value={averageRating || 0}
              precision={0.5}
              readOnly
            />
            <Button 
              startIcon={<CommentIcon />}
              color="info"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onShowReviews(product);
              }}
              sx={{ ml: 1 }}
            >
              Reviews
            </Button>
          </Box>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => {
              e.stopPropagation();
              onQuantityChange(product._id, e.target.value);
            }}
            inputProps={{ min: 1 }}
            size="small"
            fullWidth
          />
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ mt: 1, backgroundColor: 'black', color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
