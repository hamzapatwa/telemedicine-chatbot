// src/Login.js

import React from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const userId = userCredential.user.uid;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        // Check if doctor is verified
        if (userData.accountType === 'doctor' && !userData.verified) {
          alert('Your account is pending verification.');
          await auth.signOut();
          return;
        }

        alert('Logged in successfully!');

        // Redirect to appropriate dashboard
        if (userData.accountType === 'user') {
          navigate('/user/dashboard');
        } else {
          navigate('/doctor/dashboard');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in: ' + error.message);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        {/* Email Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        {/* Submit Button */}
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
}

export default Login;
