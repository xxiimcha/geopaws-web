// src/LoginPage.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Box, Button, TextField, Typography, Alert, Container, Paper, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Create a blue theme using MUI's theme provider
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue primary color
    },
    secondary: {
      main: '#1e88e5',
    },
  },
});

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");  // Clear any existing errors
    setLoading(true);  // Set loading to true when login starts

    try {
      console.log("Attempting login with email:", email);
      
      // Authenticate user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Firebase authentication successful for:", user.email);

      // Fetch user from Firestore 'users' collection
      const q = query(collection(db, "users"), where("email", "==", user.email), where("type", "==", "admin"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Admin login successful for:", user.email);
        setLoading(false);  // Stop loading
        onLoginSuccess();  // Login success for admin
      } else {
        console.log("Failed: User is not an admin.");
        setLoading(false);  // Stop loading
        setError("Only admins are allowed to log in.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false);  // Stop loading
      setError("Failed to log in. Please check your credentials.");
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);  // Toggle password visibility
  };

  const handleInputChange = (e) => {
    setError("");  // Clear error when the user starts typing again
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ marginTop: 8 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Admin Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={handleInputChange}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}  // Toggle between text and password type
              id="password"
              value={password}
              onChange={handleInputChange}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handlePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}  // Disable button when loading
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
