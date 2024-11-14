// src/components/ManageRequests.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Sidebar from './Sidebar';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      const requestsCollection = collection(db, 'request');
      const requestsSnapshot = await getDocs(requestsCollection);
      const requestsList = requestsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestsList);
    };

    fetchRequests();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle view request details
  const handleView = async (request) => {
    setSelectedRequest(request);

    // Fetch pet details
    const petDoc = await getDoc(doc(db, 'pet', request.petId));
    if (petDoc.exists()) {
      setPetDetails(petDoc.data());
    }

    // Fetch user details
    const userDoc = await getDoc(doc(db, 'users', request.uid));
    if (userDoc.exists()) {
      setUserDetails(userDoc.data());
    }

    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
    setPetDetails(null);
    setUserDetails(null);
  };

  // Handle delete request
  const handleDelete = async (requestId) => {
    await deleteDoc(doc(db, 'request', requestId));
    setRequests((prevRequests) => prevRequests.filter((request) => request.id !== requestId));
  };

  // Handle approve request
  const handleApprove = async () => {
    if (selectedRequest) {
      const requestRef = doc(db, 'request', selectedRequest.id);
      await updateDoc(requestRef, { status: 'Approved' });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequest.id ? { ...request, status: 'Approved' } : request
        )
      );
      handleClose();
    }
  };

  // Handle decline request
  const handleDecline = async () => {
    if (selectedRequest) {
      const requestRef = doc(db, 'request', selectedRequest.id);
      await updateDoc(requestRef, { status: 'Declined' });
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === selectedRequest.id ? { ...request, status: 'Declined' } : request
        )
      );
      handleClose();
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar /> {/* Sidebar displayed on the left */}

      <Box sx={{ flexGrow: 1, padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Manage Requests
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.fullname}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleView(request)} sx={{ marginRight: 1 }}>
                      View
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(request.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={requests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        {/* Dialog for Viewing Details */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent dividers>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {selectedRequest && (
                    <>
                      <TableRow>
                        <TableCell><strong>Full Name</strong></TableCell>
                        <TableCell>{selectedRequest.fullname}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell>{selectedRequest.status}</TableCell>
                      </TableRow>
                    </>
                  )}

                  {userDetails && (
                    <>
                      <TableRow>
                        <TableCell><strong>User Email</strong></TableCell>
                        <TableCell>{userDetails.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Contact</strong></TableCell>
                        <TableCell>{userDetails.contact}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Address</strong></TableCell>
                        <TableCell>{userDetails.address}</TableCell>
                      </TableRow>
                    </>
                  )}

                  {petDetails && (
                    <>
                      <TableRow>
                        <TableCell><strong>Pet Name</strong></TableCell>
                        <TableCell>{petDetails.first_owner}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Breed</strong></TableCell>
                        <TableCell>{petDetails.breed}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Age</strong></TableCell>
                        <TableCell>{petDetails.age}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Health Issues</strong></TableCell>
                        <TableCell>{petDetails.health_issues}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Additional Details</strong></TableCell>
                        <TableCell>{petDetails.additional_details}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            {selectedRequest && selectedRequest.status === "Pending" && (
              <>
                <Button onClick={handleApprove} color="primary">Approve</Button>
                <Button onClick={handleDecline} color="secondary">Decline</Button>
              </>
            )}
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManageRequests;
