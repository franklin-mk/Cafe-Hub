// src/pages/Customer/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../../url';
import { useUser } from '../../contexts/UserContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommentIcon from '@mui/icons-material/Comment';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    // Fetch all products first
    fetchAllProducts();
  }, []);

  useEffect(() => {
    // When productId changes or allProducts is loaded, fetch specific product data
    if (productId && allProducts.length > 0) {
      fetchProductData();
    }
  }, [productId, allProducts]);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${URL}/api/products`);
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching all products:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load products. Please try again later.',
        severity: 'error'
      });
    }
  };

  const fetchProductData = async () => {
    setLoading(true);
    
    // First, try to get the product from the allProducts array
    const foundProduct = allProducts.find(p => p._id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    try {
      // Fetch reviews for this product
      const reviewsResponse = await axios.get(`${URL}/api/ratings-reviews/${productId}`);
      setReviews(reviewsResponse.data);
      calculateAverageRating(reviewsResponse.data);
      
      // If we didn't find the product in allProducts, try to get it from the reviews
      if (!foundProduct && reviewsResponse.data.length > 0) {
        // Try to extract product details from the first review
        const reviewWithProduct = reviewsResponse.data.find(r => r.product && typeof r.product === 'object');
        
        if (reviewWithProduct && reviewWithProduct.product) {
          // If we found product details in a review, use it
          setProduct(reviewWithProduct.product);
        } else {
          // If no product details in reviews, make a direct API call
          try {
            const productResponse = await axios.get(`${URL}/api/products/${productId}`);
            setProduct(productResponse.data);
          } catch (productError) {
            console.error('Error fetching from products API:', productError);
            setSnackbar({
              open: true,
              message: 'Product details could not be loaded.',
              severity: 'error'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load reviews. Please try again later.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (reviewsData) => {
    if (!reviewsData || reviewsData.length === 0) {
      setAverageRating(0);
      return;
    }
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating(sum / reviewsData.length);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setSnackbar({ 
        open: true, 
        message: 'Please log in to add to cart.', 
        severity: 'warning' 
      });
      return;
    }

    if (!product || !product._id) {
      setSnackbar({ 
        open: true, 
        message: 'Product information is incomplete. Please refresh the page.', 
        severity: 'error' 
      });
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        `${URL}/api/cart/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSnackbar({ 
        open: true, 
        message: 'Product added to cart successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error adding to cart. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setSnackbar({ 
        open: true, 
        message: 'Please log in to submit a review.', 
        severity: 'warning' 
      });
      return;
    }
    
    if (newRating === 0) {
      setSnackbar({ 
        open: true, 
        message: 'Please select a rating.', 
        severity: 'warning' 
      });
      return;
    }

    if (!newReview.trim()) {
      setSnackbar({ 
        open: true, 
        message: 'Please write a review comment.', 
        severity: 'warning' 
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await axios.post(
        `${URL}/api/ratings-reviews`,
        { 
          product: productId, 
          rating: newRating, 
          review: newReview 
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Add the new review to state without refetching all reviews
      const newReviewData = response.data;
      
      // Make sure we have the customer name in the new review
      if (!newReviewData.customer && user) {
        newReviewData.customer = { name: user.name || 'You' };
      }
      
      const updatedReviews = [...reviews, newReviewData];
      setReviews(updatedReviews);
      calculateAverageRating(updatedReviews);
      
      setSnackbar({ 
        open: true, 
        message: 'Review submitted successfully!', 
        severity: 'success' 
      });
      setNewRating(0);
      setNewReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error submitting review. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Enhanced logic to ensure we display product price
  const getProductPrice = () => {
    if (product && product.price !== undefined) {
      return product.price;
    }
    
    // Try to find price from reviews
    const reviewWithProduct = reviews.find(r => 
      r.product && typeof r.product === 'object' && r.product.price !== undefined
    );
    
    if (reviewWithProduct && reviewWithProduct.product) {
      return reviewWithProduct.product.price;
    }
    
    return null;
  };

  // Enhanced logic to ensure we display product image
  const getProductImage = () => {
    if (product && product.image) {
      return product.image;
    }
    
    // Try to find image from reviews
    const reviewWithProduct = reviews.find(r => 
      r.product && typeof r.product === 'object' && r.product.image
    );
    
    if (reviewWithProduct && reviewWithProduct.product) {
      return reviewWithProduct.product.image;
    }
    
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 8
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading product details...
          </Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ flex: 1, py: 8 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Product not found
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              The product you're looking for might have been removed or is temporarily unavailable.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/customer')}
              sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}
            >
              Back to Products
            </Button>
          </Paper>
        </Container>
        <Footer />
      </Box>
    );
  }

  const productPrice = getProductPrice();
  const productImage = getProductImage();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/customer')}
          >
            Home
          </Link>
          {product.category && (
            <div
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/customer/category/${product.category}`)}
            >
              {product.category}
            </div>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Product Details Section */}
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
              }}
            >
              {productImage ? (
                <Box
                  component="img"
                  src={productImage}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src="https://via.placeholder.com/400x400?text=No+Image"
                  alt="No image available"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  {product.category && (
                    <Chip
                      label={product.category}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  )}
                  <Typography variant="h4" component="h1" gutterBottom>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={averageRating} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </Typography>
                  </Box>
                  
                  <Typography variant="h5" color="primary" gutterBottom>
                    {productPrice !== null 
                      ? `Ksh. ${parseFloat(productPrice).toFixed(2)}` 
                      : 'Price unavailable'}
                  </Typography>
                  
                  {product.stockCount !== undefined && (
                    <Typography variant="body2" color={product.stockCount > 0 ? 'success.main' : 'error.main'}>
                      {product.stockCount > 0 ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body1" paragraph>
                  {product.description || 'No description available'}
                </Typography>

                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mt: 3 }}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1 }}
                    size="small"
                    sx={{ width: '100px', mr: 2 }}
                    disabled={addingToCart || (product.stockCount !== undefined && product.stockCount <= 0)}
                  />
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={addingToCart || (product.stockCount !== undefined && product.stockCount <= 0)}
                    sx={{ 
                      mt: 1, 
                      backgroundColor: 'black', 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#333',
                      }
                    }}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CommentIcon sx={{ mr: 1 }} />
            Customer Reviews
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* Add Review Form */}
          {user ? (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <form onSubmit={handleSubmitReview}>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend">Your Rating</Typography>
                    <Rating
                      name="new-rating"
                      value={newRating}
                      onChange={(_, value) => setNewRating(value)}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submittingReview}
                    sx={{ 
                      backgroundColor: 'black', 
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#333',
                      }
                    }}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Paper elevation={1} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                Please log in to write a review.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/login')}
                sx={{ mt: 1 }}
              >
                Log In
              </Button>
            </Paper>
          )}

          {/* Review List */}
          {reviews.length > 0 ? (
            <Grid container spacing={2}>
              {reviews.map((review) => (
                <Grid item xs={12} key={review._id || `review-${review.rating}-${Math.random()}`}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">
                        {review.customer ? review.customer.name : 'Anonymous User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently added'}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body1">{review.review}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No reviews yet. Be the first to review this product!
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity || 'info'}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetailPage;