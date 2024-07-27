// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  Popover,
  MenuItem
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useUser } from '../contexts/UserContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const open = Boolean(anchorEl);

  const menuItems = [
    { text: 'Reviews', icon: <RateReviewIcon />, link: '/reviews' },
    { 
      text: 'My Orders', 
      icon: <ShoppingCartIcon />, 
      link: user && user.role === 'admin' ? '/admin/orders' : '/customer/orders' 
    },
  ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <LocalCafeIcon sx={{ mr: 1 }} />
            Cafe'Hub
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {menuItems.map((item) => (
              <Button color="inherit" component={Link} to={item.link} key={item.text}>
                {item.icon} {item.text}
              </Button>
            ))}
          </Box>
          
          {user && user.role !== 'admin' && (
            <Button color="inherit" component={Link} to="/cart">
              <ShoppingCartIcon /> Cart
            </Button>
          )}
          {user && (
            <>
              <Button color="inherit" onClick={handleClick} startIcon={<AccountCircleIcon />}>
                {user.name}
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Popover>
            </>
          )}
        </Box>
      </Toolbar>
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.link} onClick={toggleMenu}>
              <IconButton>{item.icon}</IconButton>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
