// src/components/Sidebar.js
import React, { useState } from "react";
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Avatar, Typography, Box } from "@mui/material";
import { ExpandLess, ExpandMore, Home, Pets, Report, Message, Feedback, Person } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

const SidebarContainer = styled('div')({
  width: "250px",
  backgroundColor: "#1f2937",
  color: "#fff",
  height: "100vh",
  paddingTop: "20px",
});

const Sidebar = () => {
  const [openPets, setOpenPets] = useState(false);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handlePetsClick = () => {
    setOpenPets(!openPets);
  };

  return (
    <SidebarContainer>
      <Typography variant="h6" align="center" gutterBottom>
        Geopaws
      </Typography>
      <List component="nav">
        {/* Home */}
        <ListItem button onClick={() => navigate('/')}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* Pets (Expandable) */}
        <ListItem button onClick={handlePetsClick}>
          <ListItemIcon sx={{ color: "#fff" }}>
            <Pets />
          </ListItemIcon>
          <ListItemText primary="Pets" />
          {openPets ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openPets} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Navigate to Add Pets */}
            <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/add-pets')}>
              <ListItemText primary="Add Pets" />
            </ListItem>
            {/* Placeholder for Manage Pets */}
            <ListItem button sx={{ pl: 4 }} onClick={() => navigate('/manage-pets')}>
              <ListItemText primary="Manage Pets" />
            </ListItem>
          </List>
        </Collapse>

        {/* Reports */}
        <ListItem button>
          <ListItemIcon sx={{ color: "#fff" }} onClick={() => navigate('/reports')}>
            <Report />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>

        {/* Messages */}
        <ListItem button>
          <ListItemIcon sx={{ color: "#fff" }}>
            <Message />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItem>

        {/* Feedback */}
        <ListItem button>
          <ListItemIcon sx={{ color: "#fff" }}>
            <Feedback />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>

        {/* Users */}
        <ListItem button>
          <ListItemIcon sx={{ color: "#fff" }}>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>

      </List>
    </SidebarContainer>
  );
};

export default Sidebar;

