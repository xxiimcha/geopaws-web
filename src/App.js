// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import LandingPage from "./LandingPage";
import AddPets from "./components/AddPets";
import ManagePets from "./components/ManagePets";
import Reports from "./components/Reports";
import Feedback from "./components/Feedback";
import ManagePetReports from './components/ManagePetReports';
import ManageRequests from './components/ManageRequests';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);  // Make sure this sets the state to true on login
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <LandingPage /> : <Navigate to="/login" />}
          />
          
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          
          <Route
            path="/add-pets"
            element={isAuthenticated ? <AddPets /> : <Navigate to="/login" />}
          />
          
          <Route
            path="/manage-pets"
            element={isAuthenticated ? <ManagePets /> : <Navigate to="/login" />}
          />

          <Route
            path="/feedback"
            element={isAuthenticated ? <Feedback /> : <Navigate to="/login" />}
          />

          <Route path="/pet-reports" element={<ManagePetReports />} />
          <Route path="/requests" element={<ManageRequests />} />

          <Route path="/reports" element={<Reports />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
