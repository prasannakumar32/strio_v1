import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

const ConsumptionViewSite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: ''
  });

  const handleOpenForm = () => {
    setFormData({ month: '', c1: '', c2: '', c3: '', c4: '', c5: '' });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSubmit = () => {
    const total = Number(formData.c1) + Number(formData.c2) + Number(formData.c3) + 
                 Number(formData.c4) + Number(formData.c5);
    const newEntry = { ...formData, total };
    setHistoricalData([...historicalData, newEntry]);
    handleCloseForm();
  };

  const handleDelete = (month) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setHistoricalData(historicalData.filter(item => item.month !== month));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Consumption History</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleOpenForm}>+ Enter New Data</Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>C1 (Units)</TableCell>
                <TableCell>C2 (Units)</TableCell>
                <TableCell>C3 (Units)</TableCell>
                <TableCell>C4 (Units)</TableCell>
                <TableCell>C5 (Units)</TableCell>
                <TableCell>Total (Units)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicalData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.c1}</TableCell>
                  <TableCell>{row.c2}</TableCell>
                  <TableCell>{row.c3}</TableCell>
                  <TableCell>{row.c4}</TableCell>
                  <TableCell>{row.c5}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenForm(row)} size="small"><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(row.month)} size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Enter New Consumption Data</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}><TextField fullWidth label="Month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C1 Consumption (Units)" type="number" value={formData.c1} onChange={(e) => setFormData({ ...formData, c1: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C2 Consumption (Units)" type="number" value={formData.c2} onChange={(e) => setFormData({ ...formData, c2: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C3 Consumption (Units)" type="number" value={formData.c3} onChange={(e) => setFormData({ ...formData, c3: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C4 Consumption (Units)" type="number" value={formData.c4} onChange={(e) => setFormData({ ...formData, c4: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="C5 Consumption (Units)" type="number" value={formData.c5} onChange={(e) => setFormData({ ...formData, c5: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsumptionViewSite;
