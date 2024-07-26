import { Link as RouterLink } from "react-router-dom";
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  Divider 
} from "@mui/material";
import { 
  GitHub as GitHubIcon, 
  WhatsApp as WhatsAppIcon, 
  Email as EmailIcon, 
  Instagram as InstagramIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: "primary.main", 
        color: "primary.contrastText", 
        mt: 8,
        width: '100%',
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} py={8}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Developer's Info
            </Typography>
            <Typography variant="body2">Franklin M</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Support Contact
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ mr: 1 }} fontSize="small" />
              (+254) 716205591
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Socials
            </Typography>
            <Box>
              <IconButton 
                component={Link} 
                href="https://github.com/franklin-mk" 
                target="_blank" 
                rel="noopener noreferrer"
                color="inherit"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton 
                component={Link} 
                href="https://wa.me/254716205591" 
                target="_blank" 
                rel="noopener noreferrer"
                color="inherit"
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton 
                component={Link} 
                href="mailto:franklinmuriithi431@gmail.com" 
                color="inherit"
              >
                <EmailIcon />
              </IconButton>
              <IconButton 
                component={Link} 
                href="https://www.instagram.com/_.jus.not.ur_frank" 
                target="_blank" 
                rel="noopener noreferrer"
                color="inherit"
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: 'primary.contrastText' }} />
        <Box py={3} display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">
            © {new Date().getFullYear()} CAFE'HUB. All rights reserved.
          </Typography>
          <Box>
            <Link component={RouterLink} to="/terms" color="inherit" sx={{ mx: 1 }}>
              Terms of Use
            </Link>
            <Link component={RouterLink} to="/privacy" color="inherit" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;