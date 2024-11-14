// src/components/ManagePetReports.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Sidebar from './Sidebar';

const ManagePetReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  // Fetch pet reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      const reportsCollection = collection(db, 'pet_reports');
      const reportsSnapshot = await getDocs(reportsCollection);
      const reportsList = reportsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsList);
    };

    fetchReports();
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

  // Handle view report details
  const handleView = (report) => {
    setSelectedReport(report);
    setStatus(report.status || "");  // Set initial status from report data
    setRemarks(report.remarks || "");  // Set initial remarks from report data
    setOpen(true);
  };

  // Handle delete report
  const handleDelete = async (reportId) => {
    await deleteDoc(doc(db, 'pet_reports', reportId));
    setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
  };

  // Handle status change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // Handle remarks change
  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  // Save status and remarks changes to Firestore
  const handleSaveChanges = async () => {
    if (selectedReport) {
      const reportRef = doc(db, 'pet_reports', selectedReport.id);
      await updateDoc(reportRef, { status, remarks });
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === selectedReport.id ? { ...report, status, remarks } : report
        )
      );
      handleClose();
    }
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedReport(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar /> {/* Sidebar displayed on the left */}

      <Box sx={{ flexGrow: 1, padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Manage Pet Reports
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Concern</TableCell>
                <TableCell>Date Lost</TableCell>
                <TableCell>Location Lost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.pet_name}</TableCell>
                  <TableCell>{report.date_lost}</TableCell>
                  <TableCell>{report.location_lost}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleView(report)} sx={{ marginRight: 1 }}>
                      View
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(report.id)}>
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
          count={reports.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />

        {/* Dialog for Viewing Details */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Pet Report Details</DialogTitle>
          <DialogContent>
            {selectedReport && (
              <>
                <DialogContentText><strong>Concern:</strong> {selectedReport.pet_name}</DialogContentText>
                <DialogContentText><strong>Date Lost:</strong> {selectedReport.date_lost}</DialogContentText>
                <DialogContentText><strong>Time Lost:</strong> {selectedReport.time_lost}</DialogContentText>
                <DialogContentText><strong>Location Lost:</strong> {selectedReport.location_lost}</DialogContentText>
                <DialogContentText><strong>Status:</strong> {selectedReport.status}</DialogContentText>
                <DialogContentText><strong>Additional Info:</strong> {selectedReport.additional_info}</DialogContentText>
                <DialogContentText><strong>User Email:</strong> {selectedReport.user}</DialogContentText>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select value={status} onChange={handleStatusChange}>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Remarks"
                  multiline
                  rows={3}
                  value={remarks}
                  onChange={handleRemarksChange}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Cancel</Button>
            <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ManagePetReports;
