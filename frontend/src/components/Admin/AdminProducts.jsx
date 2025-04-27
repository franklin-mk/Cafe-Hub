// src/components/Admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { URL } from '../../url';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  CircularProgress,
  Rating
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommentIcon from '@mui/icons-material/Comment';

import SearchProducts from '../SearchProducts';

function AdminProductList() {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Reviews related state
  const [openReviewsDialog, setOpenReviewsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`${URL}/api/ratings-reviews/${productId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      setProductReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews. Please try again.');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleShowReviews = (product) => {
    setSelectedProduct(product);
    setOpenReviewsDialog(true);
    fetchProductReviews(product._id);
  };

  const handleSearch = (searchTerm) => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: ''
    });
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category
    });
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${URL}/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          fetchProducts();
        } else {
          const errorData = await response.json();
          setError(`Failed to delete product: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('An error occurred while deleting the product. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${URL}/api/products/${editingProduct._id}` : `${URL}/api/products`;

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formDataToSend
      });
      if (response.ok) {
        fetchProducts();
        setOpenDialog(false);
        setError('');
      } else {
        const errorData = await response.json();
        setError(`Failed to save product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError('An error occurred while saving the product. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (!user || user.role !== 'admin') {
    return <Typography variant="body1">Access denied. Admin only.</Typography>;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Manage Products
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddProduct}
          sx={{ mb: 2 }}
        >
          Add Product
        </Button>
        <SearchProducts onSearch={handleSearch} />
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Chip 
                    label={product.category} 
                    sx={{ mb: 1 }} 
                    color="primary" 
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Ksh. {product.price}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    startIcon={<EditIcon />} 
                    onClick={() => handleEditProduct(product)}
                    sx={{ mr: 1 }}
                    fullWidth
                  >
                    Edit
                  </Button>
                  <Button 
                    startIcon={<DeleteIcon />} 
                    color="error"
                    onClick={() => handleDeleteProduct(product._id)}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Delete
                  </Button>
                  <Button 
                    startIcon={<CommentIcon />} 
                    color="info"
                    onClick={() => handleShowReviews(product)}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Reviews
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span" sx={{ mt: 2 }}>
                Upload Image
              </Button>
            </label>
            {imageFile && <Typography variant="body2" sx={{ mt: 1 }}>{imageFile.name}</Typography>}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
}

export default AdminProductList;