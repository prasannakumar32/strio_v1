import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert
} from '@mui/material';
import productionApi, { 
  handleAllocation, 
  getAllocationStatus,
  ALLOCATION_RULES 
} from '../services/productionApi';

const AllocationPage = () => {
  const [productionSites, setProductionSites] = useState([]);
  const [consumptionSites, setConsumptionSites] = useState([]);
  const [bankingData, setBankingData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [openAllocationForm, setOpenAllocationForm] = useState(false);
  const [allocationFormData, setAllocationFormData] = useState({
    fromSite: '',
    toSite: '',
    units: '',
    period: '',
    type: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [production, consumption, banking, allocation] = await Promise.all([
        productionApi.getProductionData(),
        productionApi.getConsumptionData(),
        productionApi.getBankingData(),
        productionApi.getAllocationData()
      ]);

      if (production.success) setProductionSites(production.data);
      if (consumption.success) setConsumptionSites(consumption.data);
      if (banking.success) setBankingData(banking.data);
      if (allocation.success) setAllocationData(allocation.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    }
  };

  const handleOpenAllocationForm = () => {
    setOpenAllocationForm(true);
    setError('');
  };

  const handleCloseAllocationForm = () => {
    setOpenAllocationForm(false);
    setAllocationFormData({
      fromSite: '',
      toSite: '',
      units: '',
      period: '',
      type: ''
    });
    setError('');
  };

  const handleAllocation = async () => {
    try {
      const result = await productionApi.allocateUnits(allocationFormData);
      if (result.success) {
        await fetchData(); // Refresh data
        handleCloseAllocationForm();
      } else {
        setError(result.error || 'Allocation failed');
      }
    } catch (error) {
      console.error('Error in allocation:', error);
      setError(error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Allocation Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Production Sites
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Site Name</TableCell>
                <TableCell>Current Production</TableCell>
                <TableCell>Available Units</TableCell>
                <TableCell>Peak Production</TableCell>
                <TableCell>Non-Peak Production</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productionSites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.currentProduction}</TableCell>
                  <TableCell>{site.availableUnits}</TableCell>
                  <TableCell>{site.peakProduction}</TableCell>
                  <TableCell>{site.nonPeakProduction}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Banking Data
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Site Name</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Expiry Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankingData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.siteName}</TableCell>
                  <TableCell>{item.units}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAllocationForm}
        >
          Allocate Units
        </Button>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Allocation Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From Site</TableCell>
                <TableCell>To Site</TableCell>
                <TableCell>Units</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocationData.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>{allocation.fromSite}</TableCell>
                  <TableCell>{allocation.toSite}</TableCell>
                  <TableCell>{allocation.units}</TableCell>
                  <TableCell>{allocation.period}</TableCell>
                  <TableCell>{allocation.type}</TableCell>
                  <TableCell>{allocation.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openAllocationForm} onClose={handleCloseAllocationForm}>
        <DialogTitle>Allocate Units</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>From Site</InputLabel>
              <Select
                value={allocationFormData.fromSite}
                onChange={(e) => setAllocationFormData({
                  ...allocationFormData,
                  fromSite: e.target.value
                })}
              >
                {productionSites.map((site) => (
                  <MenuItem key={site.id} value={site.name}>
                    {site.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>To Site</InputLabel>
              <Select
                value={allocationFormData.toSite}
                onChange={(e) => setAllocationFormData({
                  ...allocationFormData,
                  toSite: e.target.value
                })}
              >
                <MenuItem value="Banking">Banking</MenuItem>
                {consumptionSites.map((site, index) => (
                  <MenuItem key={index} value={`Site ${String.fromCharCode(65 + index)}`}>
                    Site {String.fromCharCode(65 + index)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Units"
              type="number"
              value={allocationFormData.units}
              onChange={(e) => setAllocationFormData({
                ...allocationFormData,
                units: e.target.value
              })}
            />

            <TextField
              label="Period"
              value={allocationFormData.period}
              onChange={(e) => setAllocationFormData({
                ...allocationFormData,
                period: e.target.value
              })}
            />

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={allocationFormData.type}
                onChange={(e) => setAllocationFormData({
                  ...allocationFormData,
                  type: e.target.value
                })}
              >
                <MenuItem value="Peak">Peak</MenuItem>
                <MenuItem value="Non-Peak">Non-Peak</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllocationForm}>Cancel</Button>
          <Button onClick={handleAllocation} variant="contained">
            Allocate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllocationPage;
