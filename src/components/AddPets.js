// src/components/AddPets.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper, MenuItem } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

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
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Pet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {/* Age */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
          
          {/* Arrival Date */}
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

          {/* Breed */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
          />

          {/* Color */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
          />

          {/* Image URL */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Image URL"
            name="images"
            value={formData.images}
            onChange={handleInputChange}
          />

          {/* Sex */}
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

          {/* Size/Weight */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Size/Weight"
            name="sizeweight"
            value={formData.sizeweight}
            onChange={handleInputChange}
          />

          {/* Status */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          />

          {/* Type */}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          />

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
            Add Pet
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddPets;
