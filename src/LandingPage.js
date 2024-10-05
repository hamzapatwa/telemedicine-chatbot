// src/LandingPage.js

import React from 'react';
import { Container, Button, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Telemedicine App
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Landing Page Content */}
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Our Telemedicine App
        </Typography>
        <Typography variant="h6" gutterBottom>
          Providing AI-powered medical advice and access to real doctors.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/signup')}
          sx={{ mt: 3 }}
        >
          Get Started
        </Button>
      </Container>
    </>
  );
}

export default LandingPage;
