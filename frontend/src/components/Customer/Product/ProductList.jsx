//src/components/Customer/Product/ProductList.jsx
// MODIFY THIS FILES OR ADD NEW ONES SO THAT WHEN A PRODUCT CARD IS CLICKED IT REDIRECTS THE USER TO THAT INDIVIDUAL PRODUCTS IE DETAILS REVIEWS ETC

import React, { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import axios from 'axios';
import { URL } from '../../../url';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Snackbar,
  Rating,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import SearchProducts from '../../SearchProducts';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [averageRatings, setAverageRatings] = useState({});
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  
  // New state for reviews dialog
  const [openReviewsDialog, setOpenReviewsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${URL}/api/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      const initialQuantities = {};
      response.data.forEach(product => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
      await fetchAllReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchAllReviews = async (products) => {
    try {
      const reviewPromises = products.map(product => 
        axios.get(`${URL}/api/ratings-reviews/${product._id}`)
      );
      const reviewResponses = await Promise.all(reviewPromises);
      
      const newAverageRatings = {};
      reviewResponses.forEach((response, index) => {
        const productId = products[index]._id;
        const reviews = response.data;
        if (reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          newAverageRatings[productId] = sum / reviews.length;
        } else {
          newAverageRatings[productId] = 0;
        }
      });
      setAverageRatings(newAverageRatings);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // New function to handle showing reviews
  const handleShowReviews = (product) => {
    setSelectedProduct(product);
    setOpenReviewsDialog(true);
    setReviewsLoading(true);
    
    axios.get(`${URL}/api/ratings-reviews/${product._id}`)
      .then(response => {
        setProductReviews(response.data);
        setReviewsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setReviewsLoading(false);
        setSnackbar({ open: true, message: 'Error fetching reviews. Please try again.' });
      });
  };

  const handleSearch = (searchTerm) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const createOrder = async (product) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to place an order.' });
      return;
    }

    const quantity = quantities[product._id];
    const totalAmount = product.price * quantity;

    try {
      const response = await axios.post(`${URL}/api/orders`, {
        products: [{ product: product._id, quantity }],
        totalAmount
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSnackbar({ open: true, message: 'Order placed successfully!' });
      console.log('Order created:', response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error creating order. Please try again.' });
      console.error('Error creating order:', error);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please log in to add to cart.' });
      return;
    }

    const quantity = quantities[product._id];

    try {
      const response = await axios.post(`${URL}/api/cart/add`, {
        productId: product._id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setSnackbar({ open: true, message: 'Product added to cart successfully!' });
      console.log('Added to cart:', response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error adding to cart. Please try again.' });
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <SearchProducts onSearch={handleSearch} />
      <Grid container spacing={3}>
            {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard 
                    product={product}
                    quantity={quantities[product._id]}
                    onQuantityChange={handleQuantityChange}
                    onAddToCart={addToCart}
                    onShowReviews={handleShowReviews}
                    averageRating={averageRatings[product._id]}
                />
            </Grid>
            ))}
        </Grid>


      {/* Reviews Dialog */}
      <Dialog 
        open={openReviewsDialog} 
        onClose={() => setOpenReviewsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct && `Reviews for ${selectedProduct.name}`}
        </DialogTitle>
        <DialogContent>
          {reviewsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {productReviews.length > 0 ? (
                <Grid container spacing={2}>
                  {productReviews.map((review) => (
                    <Grid item xs={12} key={review._id}>
                      <Card elevation={2}>
                        <CardContent>
                          <Typography variant="h6">
                            {review.customer ? review.customer.name : 'Anonymous User'}
                          </Typography>
                          <Rating 
                            name={`rating-${review._id}`} 
                            value={review.rating} 
                            readOnly 
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body1">{review.review}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                      {/* <Divider sx={{ mt: 2, mb: 2 }} /> */}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" sx={{ py: 3, textAlign: 'center' }}>
                  No reviews available for this product.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default ProductList;