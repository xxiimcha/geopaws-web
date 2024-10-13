// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import AddPets from "./components/AddPets";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);  // Make sure this sets the state to true on login
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect to login if not authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <LandingPage /> : <Navigate to="/login" />}
          />
          
          {/* Login page */}
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          
          {/* Add Pets page (Protected) */}
          <Route
            path="/add-pets"
            element={isAuthenticated ? <AddPets /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
