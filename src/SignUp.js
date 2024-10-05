// src/SignUp.js

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [accountType, setAccountType] = useState('user');
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
    gender: Yup.string().required('Required'),
    age: Yup.number().min(0, 'Invalid age').required('Required'),
    // Additional validations based on account type
    ...(accountType === 'doctor' && {
      credentials: Yup.string().required('Required'),
    }),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      gender: '',
      age: '',
      medications: '',
      medicalHistory: '',
      allergies: '',
      credentials: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const userId = userCredential.user.uid;

        // Prepare user data
        const userData = {
          accountType,
          gender: values.gender,
          age: values.age,
        };

        if (accountType === 'user') {
          userData.medications = values.medications;
          userData.medicalHistory = values.medicalHistory;
          userData.allergies = values.allergies;
        } else {
          userData.credentials = values.credentials;
          userData.verified = false; // We'll verify doctors manually
        }

        // Save user data to Firestore
        await setDoc(doc(db, 'users', userId), userData);

        alert('Account created successfully!');
        // Redirect to appropriate dashboard
        if (accountType === 'user') {
          navigate('/user/dashboard');
        } else {
          alert('Your account is pending verification.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error signing up:', error);
        alert('Error signing up: ' + error.message);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>

      {/* Account Type Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Account Type</InputLabel>
        <Select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="doctor">Doctor</MenuItem>
        </Select>
      </FormControl>

      {/* Sign-Up Form */}
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

        {/* Gender Field */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            error={formik.touched.gender && Boolean(formik.errors.gender)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          {formik.touched.gender && formik.errors.gender && (
            <Typography color="error">{formik.errors.gender}</Typography>
          )}
        </FormControl>

        {/* Age Field */}
        <TextField
          fullWidth
          margin="normal"
          label="Age"
          name="age"
          type="number"
          variant="outlined"
          value={formik.values.age}
          onChange={formik.handleChange}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
        />

        {/* Conditionally Render Fields Based on Account Type */}
        {accountType === 'user' ? (
          <>
            {/* Medications Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Medications"
              name="medications"
              variant="outlined"
              value={formik.values.medications}
              onChange={formik.handleChange}
            />

            {/* Medical History Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Medical History"
              name="medicalHistory"
              variant="outlined"
              value={formik.values.medicalHistory}
              onChange={formik.handleChange}
            />

            {/* Allergies Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Allergies"
              name="allergies"
              variant="outlined"
              value={formik.values.allergies}
              onChange={formik.handleChange}
            />
          </>
        ) : (
          <>
            {/* Credentials Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Credentials"
              name="credentials"
              variant="outlined"
              value={formik.values.credentials}
              onChange={formik.handleChange}
              error={formik.touched.credentials && Boolean(formik.errors.credentials)}
              helperText={formik.touched.credentials && formik.errors.credentials}
            />
          </>
        )}

        {/* Submit Button */}
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ mt: 2 }}
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default SignUp;
