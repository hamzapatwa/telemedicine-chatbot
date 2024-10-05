// src/SymptomSelector.js

import React, { useState } from 'react';
import {
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SymptomSelector() {
  const [symptoms, setSymptoms] = useState({});
  const [severity, setSeverity] = useState({});
  const navigate = useNavigate();

  const symptomList = [
    'Fever',
    'Cough',
    'Fatigue',
    'Headache',
    // Add more symptoms as needed
  ];

  // Handle symptom checkbox change
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSymptoms((prev) => ({
      ...prev,
      [name]: checked,
    }));
    if (!checked) {
      // Remove severity if symptom is unchecked
      setSeverity((prev) => {
        const newSeverity = { ...prev };
        delete newSeverity[name];
        return newSeverity;
      });
    }
  };

  // Handle severity slider change
  const handleSliderChange = (name, value) => {
    setSeverity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Collect selected symptoms and their severity
    const selectedSymptoms = Object.keys(symptoms).filter(
      (symptom) => symptoms[symptom]
    );
    const symptomSeverity = {};
    selectedSymptoms.forEach((symptom) => {
      symptomSeverity[symptom] = severity[symptom] || 5; // Default severity
    });

    // Navigate to chatbot with symptom data
    navigate('/chatbot', {
      state: { symptoms: selectedSymptoms, severity: symptomSeverity },
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select Your Symptoms
      </Typography>
      <Grid container spacing={2}>
        {symptomList.map((symptom) => (
          <Grid item xs={12} sm={6} key={symptom}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={symptoms[symptom] || false}
                  onChange={handleCheckboxChange}
                  name={symptom}
                />
              }
              label={symptom}
            />
            {symptoms[symptom] && (
              <Slider
                value={severity[symptom] || 5}
                onChange={(e, value) => handleSliderChange(symptom, value)}
                min={1}
                max={10}
                valueLabelDisplay="auto"
              />
            )}
          </Grid>
        ))}
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit Symptoms
      </Button>
    </Container>
  );
}

export default SymptomSelector;
