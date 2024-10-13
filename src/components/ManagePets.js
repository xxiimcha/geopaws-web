// src/components/ManagePets.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Modal, Box, Typography, TablePagination } from '@mui/material';
import Sidebar from './Sidebar';

// Modal Style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ManagePets = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null); // For the modal
  const [open, setOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Fetch pets from Firestore
  const fetchPets = async () => {
    const petsCollection = collection(db, 'pet');
    const petsSnapshot = await getDocs(petsCollection);
    const petsList = petsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPets(petsList);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Handle modal open/close
  const handleOpen = (pet) => {
    setSelectedPet(pet);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Reset to first page
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Pets
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Breed</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Display only rows for the current page */}
              {pets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>{pet.age}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleOpen(pet)}>
                      View More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={pets.length}  // Total number of pets
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}  // Options for rows per page
          />
        </TableContainer>

        {/* Modal for viewing full pet details */}
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={modalStyle}>
            {selectedPet && (
            <>
                <Typography variant="h6" id="modal-modal-title" align="center" gutterBottom>
                {selectedPet.breed} Details
                </Typography>
                
                {/* Table for showing pet details */}
                <Table>
                <TableBody>
                    <TableRow>
                    <TableCell><strong>Age:</strong></TableCell>
                    <TableCell>{selectedPet.age}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Breed:</strong></TableCell>
                    <TableCell>{selectedPet.breed}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Color:</strong></TableCell>
                    <TableCell>{selectedPet.color}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Sex:</strong></TableCell>
                    <TableCell>{selectedPet.sex}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Size/Weight:</strong></TableCell>
                    <TableCell>{selectedPet.sizeweight}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Status:</strong></TableCell>
                    <TableCell>{selectedPet.status}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Type:</strong></TableCell>
                    <TableCell>{selectedPet.type}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell><strong>Arrival Date:</strong></TableCell>
                    <TableCell>{selectedPet.arrivaldate}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell colSpan={2} align="center">
                        {/* Image preview */}
                        {selectedPet.images && (
                        <img
                            src={selectedPet.images}
                            alt={selectedPet.breed}
                            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                        />
                        )}
                    </TableCell>
                    </TableRow>
                </TableBody>
                </Table>

                {/* Close button */}
                <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mt: 2 }} fullWidth>
                Close
                </Button>
            </>
            )}
        </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ManagePets;
