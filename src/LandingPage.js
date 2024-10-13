// src/LandingPage.js
import React from "react";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import Sidebar from "./components/Sidebar"; // Import Sidebar component
import { ThemeProvider, createTheme } from "@mui/material/styles";

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

const LandingPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <Container maxWidth="lg">
            <Paper elevation={3} sx={{ padding: 4 }}>
              <Typography variant="h3" align="center" gutterBottom>
                Welcome, Admin
              </Typography>
              <Typography variant="h6" align="center" sx={{ mb: 4 }}>
                This is the admin dashboard.
              </Typography>
              <Box textAlign="center">
                <Button variant="contained" color="primary" sx={{ mx: 1 }}>
                  Manage Users
                </Button>
                <Button variant="contained" color="secondary" sx={{ mx: 1 }}>
                  View Reports
                </Button>
                <Button variant="contained" color="primary" sx={{ mx: 1 }}>
                  Settings
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;
