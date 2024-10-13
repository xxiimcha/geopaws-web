// src/components/AddPets.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper, MenuItem, Grid } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Sidebar from './Sidebar';  // Import Sidebar component

const AddPets = () => {
  const [formData, setFormData] = useState({
    age: '',
    arrivaldate: '',
    breed: '',
    color: '',
    images: '',
    sex: '',
    sizeweight: '',
    status: '',
    type: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const petCollectionRef = collection(db, 'pet');
      await addDoc(petCollectionRef, formData);
      alert('Pet added successfully!');
    } catch (error) {
      console.error('Error adding pet: ', error);
      alert('Failed to add pet. Try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Add Pet Form */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="md" sx={{ marginTop: 8 }}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Add New Pet
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {/* Age */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Arrival Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Arrival Date"
                    name="arrivaldate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.arrivaldate}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Breed */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Color */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Image URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Image URL"
                    name="images"
                    value={formData.images}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Sex */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    select
                    label="Sex"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>

                {/* Size/Weight */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Size/Weight"
                    name="sizeweight"
                    value={formData.sizeweight}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Type */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                Add Pet
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AddPets;
