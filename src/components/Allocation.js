import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Grid, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  IconButton, 
  Fab, 
  Chip, 
  Alert 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Layout from './Layout';

const Allocation = () => {
  const [productionAllocations, setProductionAllocations] = useState([]);
  const [consumptionAllocations, setConsumptionAllocations] = useState([]);
  const [openProductionDialog, setOpenProductionDialog] = useState(false);
  const [openConsumptionDialog, setOpenConsumptionDialog] = useState(false);
  const [editingProduction, setEditingProduction] = useState(null);
  const [editingConsumption, setEditingConsumption] = useState(null);
  const [newProduction, setNewProduction] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: '',
    total: ''
  });
  const [newConsumption, setNewConsumption] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: '',
    total: ''
  });
  const [allocatedResults, setAllocatedResults] = useState([]);

  // Load allocations on component mount
  useEffect(() => {
    try {
      console.log('Loading allocations...');
      const userStr = localStorage.getItem('user');
      console.log('User data on load:', userStr);

      if (!userStr) {
        console.warn('No user data found');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user?.id || 'default';
      console.log('Using user ID:', userId);

      // Load allocations with debug logging
      const storedProductionAllocations = JSON.parse(
        localStorage.getItem(`productionAllocations_${userId}`) || '[]'
      );
      console.log('Loaded production allocations:', storedProductionAllocations);

      const storedConsumptionAllocations = JSON.parse(
        localStorage.getItem(`consumptionAllocations_${userId}`) || '[]'
      );
      console.log('Loaded consumption allocations:', storedConsumptionAllocations);

      setProductionAllocations(storedProductionAllocations);
      setConsumptionAllocations(storedConsumptionAllocations);
    } catch (error) {
      console.error('Error loading allocations:', error);
    }
  }, []);

  // Add new production allocation
  const handleAddProduction = () => {
    setEditingProduction(null);
    setNewProduction({
      month: '',
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      total: ''
    });
    setOpenProductionDialog(true);
  };

  // Add new consumption allocation
  const handleAddConsumption = () => {
    setEditingConsumption(null);
    setNewConsumption({
      month: '',
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      total: ''
    });
    setOpenConsumptionDialog(true);
  };

  // Production handlers
  const handleEditProduction = (allocation) => {
    setEditingProduction(allocation);
    setNewProduction({
      month: allocation.month,
      c1: allocation.c1,
      c2: allocation.c2,
      c3: allocation.c3,
      c4: allocation.c4,
      c5: allocation.c5,
      total: allocation.total
    });
    setOpenProductionDialog(true);
  };

  const handleDeleteProduction = (id) => {
    try {
      if (!id) {
        console.error('No allocation ID provided');
        return;
      }

      if (window.confirm('Are you sure you want to delete this production allocation?')) {
        const userStr = localStorage.getItem('user');
        const userId = userStr ? JSON.parse(userStr)?.id : 'default';
        
        const updatedAllocations = productionAllocations.filter(
          allocation => allocation.id !== id
        );
        
        setProductionAllocations(updatedAllocations);
        localStorage.setItem(
          `productionAllocations_${userId}`, 
          JSON.stringify(updatedAllocations)
        );
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
      alert('Failed to delete allocation. Please try again.');
    }
  };

  // Consumption handlers
  const handleEditConsumption = (allocation) => {
    setEditingConsumption(allocation);
    setNewConsumption({
      month: allocation.month,
      c1: allocation.c1,
      c2: allocation.c2,
      c3: allocation.c3,
      c4: allocation.c4,
      c5: allocation.c5,
      total: allocation.total
    });
    setOpenConsumptionDialog(true);
  };

  const handleDeleteConsumption = (id) => {
    try {
      if (!id) {
        console.error('No allocation ID provided');
        return;
      }

      if (window.confirm('Are you sure you want to delete this consumption allocation?')) {
        const userStr = localStorage.getItem('user');
        const userId = userStr ? JSON.parse(userStr)?.id : 'default';
        
        const updatedAllocations = consumptionAllocations.filter(
          allocation => allocation.id !== id
        );
        
        setConsumptionAllocations(updatedAllocations);
        localStorage.setItem(
          `consumptionAllocations_${userId}`, 
          JSON.stringify(updatedAllocations)
        );
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
      alert('Failed to delete allocation. Please try again.');
    }
  };

  // Also add total calculation functions
  const calculateProductionTotal = (data) => {
    const total = ['c1', 'c2', 'c3', 'c4', 'c5']
      .reduce((sum, field) => sum + Number(data[field] || 0), 0);
    return total;
  };

  const calculateConsumptionTotal = (data) => {
    const total = ['c1', 'c2', 'c3', 'c4', 'c5']
      .reduce((sum, field) => sum + Number(data[field] || 0), 0);
    return total;
  };

  // Update submit handlers to include total calculation
  const handleProductionSubmit = () => {
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : 'default';

      const total = calculateProductionTotal(newProduction);
      const newEntry = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        siteName: "Tirunelveli Wind Farm",
        date: new Date().toISOString(),
        ...newProduction,
        total
      };

      const updatedAllocations = editingProduction
        ? productionAllocations.map(item => 
            item.id === editingProduction.id ? { ...item, ...newProduction, total } : item
          )
        : [...productionAllocations, newEntry];

      setProductionAllocations(updatedAllocations);
      localStorage.setItem(`productionAllocations_${userId}`, JSON.stringify(updatedAllocations));
      setOpenProductionDialog(false);
      setEditingProduction(null);
      setNewProduction({
        month: '',
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: '',
        total: ''
      });
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to save allocation. Please try again.');
    }
  };

  const handleConsumptionSubmit = () => {
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : 'default';

      const total = calculateConsumptionTotal(newConsumption);
      const newEntry = {
        id: `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        siteName: "Chennai Industrial Park",
        date: new Date().toISOString(),
        ...newConsumption,
        total
      };

      const updatedAllocations = editingConsumption
        ? consumptionAllocations.map(item => 
            item.id === editingConsumption.id ? { ...item, ...newConsumption, total } : item
          )
        : [...consumptionAllocations, newEntry];

      setConsumptionAllocations(updatedAllocations);
      localStorage.setItem(`consumptionAllocations_${userId}`, JSON.stringify(updatedAllocations));
      setOpenConsumptionDialog(false);
      setEditingConsumption(null);
      setNewConsumption({
        month: '',
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: '',
        total: ''
      });
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to save allocation. Please try again.');
    }
  };

  // Add this function before the return statement
  const handleAutoAllocate = () => {
    try {
      // Debug logging
      console.log('Starting auto allocation...');
      console.log('Production allocations:', productionAllocations);
      console.log('Consumption allocations:', consumptionAllocations);

      // Validate if we have data to allocate
      if (!productionAllocations.length || !consumptionAllocations.length) {
        throw new Error('Please add both production and consumption data before allocation');
      }

      // Group allocations by month
      const monthlyAllocations = {};
      
      // First, collect all unique months
      const allMonths = new Set([
        ...productionAllocations.map(p => p.month),
        ...consumptionAllocations.map(c => c.month)
      ]);

      // Initialize monthly allocations
      allMonths.forEach(month => {
        monthlyAllocations[month] = {
          production: productionAllocations.filter(p => p.month === month),
          consumption: consumptionAllocations.filter(c => c.month === month)
        };
      });

      const allocations = [];

      // Process each month
      Object.entries(monthlyAllocations).forEach(([month, data]) => {
        const { production, consumption } = data;

        // Skip if no matching data for the month
        if (!production.length || !consumption.length) return;

        production.forEach(prod => {
          consumption.forEach(cons => {
            // Handle peak hours (C3, C4)
            const peakValues = {
              c3: Math.min(Number(prod.c3) || 0, Number(cons.c3) || 0),
              c4: Math.min(Number(prod.c4) || 0, Number(cons.c4) || 0)
            };

            if (peakValues.c3 > 0 || peakValues.c4 > 0) {
              allocations.push({
                id: `peak_${Date.now()}_${Math.random()}`,
                fromSite: prod.siteName,
                toSite: cons.siteName,
                month: month,
                c1: 0,
                c2: 0,
                c3: peakValues.c3,
                c4: peakValues.c4,
                c5: 0,
                total: peakValues.c3 + peakValues.c4,
                type: 'peak',
                date: new Date().toISOString()
              });
            }

            // Handle non-peak hours (C1, C2, C5)
            const nonPeakValues = {
              c1: Math.min(Number(prod.c1) || 0, Number(cons.c1) || 0),
              c2: Math.min(Number(prod.c2) || 0, Number(cons.c2) || 0),
              c5: Math.min(Number(prod.c5) || 0, Number(cons.c5) || 0)
            };

            if (nonPeakValues.c1 > 0 || nonPeakValues.c2 > 0 || nonPeakValues.c5 > 0) {
              allocations.push({
                id: `nonpeak_${Date.now()}_${Math.random()}`,
                fromSite: prod.siteName,
                toSite: cons.siteName,
                month: month,
                c1: nonPeakValues.c1,
                c2: nonPeakValues.c2,
                c3: 0,
                c4: 0,
                c5: nonPeakValues.c5,
                total: nonPeakValues.c1 + nonPeakValues.c2 + nonPeakValues.c5,
                type: 'non-peak',
                date: new Date().toISOString()
              });
            }

            // Handle banking for remaining peak power
            const remainingPeak = {
              c3: Math.max(0, Number(prod.c3 || 0) - Number(cons.c3 || 0)),
              c4: Math.max(0, Number(prod.c4 || 0) - Number(cons.c4 || 0))
            };

            if (remainingPeak.c3 > 0 || remainingPeak.c4 > 0) {
              allocations.push({
                id: `banking_${Date.now()}_${Math.random()}`,
                fromSite: prod.siteName,
                toSite: 'Banking',
                month: month,
                c1: 0,
                c2: 0,
                c3: remainingPeak.c3,
                c4: remainingPeak.c4,
                c5: 0,
                total: remainingPeak.c3 + remainingPeak.c4,
                type: 'banking',
                isBanking: true,
                date: new Date().toISOString()
              });
            }
          });
        });
      });

      if (!allocations.length) {
        throw new Error('No valid allocations could be made');
      }

      // Update state and storage
      setAllocatedResults(allocations);
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr)?.id : 'default';
      localStorage.setItem(`autoAllocations_${userId}`, JSON.stringify(allocations));

      console.log('Allocation completed successfully:', allocations);

    } catch (error) {
      console.error('Auto allocation failed:', error);
      alert(error.message || 'Failed to perform auto allocation. Please try again.');
    }
  };

  // Add a new section to show allocation results
  const renderAllocationResults = () => {
    if (!allocatedResults.length) return null;

    // Calculate summary statistics
    const summary = allocatedResults.reduce((acc, allocation) => {
      if (allocation.isBanking) {
        acc.totalBanking += allocation.total;
      } else {
        acc.totalAllocated += allocation.total;
      }
      return acc;
    }, { totalAllocated: 0, totalBanking: 0 });

    // Calculate total production
    const totalProduction = productionAllocations.reduce((sum, prod) => sum + (prod.total || 0), 0);
    const lapse = totalProduction - (summary.totalAllocated + summary.totalBanking);

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Allocation Results
        </Typography>

        {/* Summary Cards */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              flex: 1, 
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }}
          >
            <Typography variant="h6">Total Production</Typography>
            <Typography variant="h4">{totalProduction} Units</Typography>
          </Paper>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              flex: 1, 
              bgcolor: 'success.light',
              color: 'success.contrastText'
            }}
          >
            <Typography variant="h6">Total Allocated</Typography>
            <Typography variant="h4">{summary.totalAllocated} Units</Typography>
          </Paper>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              flex: 1, 
              bgcolor: 'warning.light',
              color: 'warning.contrastText'
            }}
          >
            <Typography variant="h6">Total Banking</Typography>
            <Typography variant="h4">{summary.totalBanking} Units</Typography>
          </Paper>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              flex: 1, 
              bgcolor: 'error.light',
              color: 'error.contrastText'
            }}
          >
            <Typography variant="h6">Lapse</Typography>
            <Typography variant="h4">{Math.max(0, lapse)} Units</Typography>
          </Paper>
        </Box>

        {/* Detailed Allocation Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>From Site</TableCell>
                <TableCell>To Site</TableCell>
                <TableCell>C1 (Non-Peak)</TableCell>
                <TableCell>C2 (Non-Peak)</TableCell>
                <TableCell>C3 (Peak)</TableCell>
                <TableCell>C4 (Peak)</TableCell>
                <TableCell>C5 (Non-Peak)</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocatedResults.map((allocation, index) => {
                // Calculate running balance
                const runningTotal = allocatedResults
                  .slice(0, index + 1)
                  .reduce((sum, a) => sum + a.total, 0);
                const balance = totalProduction - runningTotal;

                return (
                  <TableRow 
                    key={allocation.id}
                    sx={{
                      backgroundColor: allocation.isBanking 
                        ? 'rgba(255, 244, 229, 0.5)' 
                        : 'inherit'
                    }}
                  >
                    <TableCell>{allocation.month}</TableCell>
                    <TableCell>{allocation.fromSite}</TableCell>
                    <TableCell>{allocation.toSite}</TableCell>
                    <TableCell>{allocation.c1}</TableCell>
                    <TableCell>{allocation.c2}</TableCell>
                    <TableCell sx={{ color: 'error.main' }}>{allocation.c3}</TableCell>
                    <TableCell sx={{ color: 'error.main' }}>{allocation.c4}</TableCell>
                    <TableCell>{allocation.c5}</TableCell>
                    <TableCell>{allocation.total}</TableCell>
                    <TableCell>
                      <Chip 
                        label={allocation.isBanking ? 'Banking' : 'Direct'} 
                        color={allocation.isBanking ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{Math.max(0, balance)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Banking Details (if applicable) */}
        {summary.totalBanking > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.lighter', borderRadius: 1 }}>
            <Typography variant="h6" color="warning.dark" gutterBottom>
              Banking Details
            </Typography>
            <Typography variant="body1">
              Total Power Banked: {summary.totalBanking} Units
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Note: Banking is only available for peak hours (C3, C4) in wind mills
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Layout>
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Production Table */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Production Allocation
          </Typography>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Site Name</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>C1 (Units)</TableCell>
                <TableCell>C2 (Units)</TableCell>
                <TableCell>C3 (Units)</TableCell>
                <TableCell>C4 (Units)</TableCell>
                <TableCell>C5 (Units)</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productionAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>{allocation.siteName}</TableCell>
                  <TableCell>{allocation.month}</TableCell>
                  <TableCell>{allocation.c1}</TableCell>
                  <TableCell>{allocation.c2}</TableCell>
                  <TableCell>{allocation.c3}</TableCell>
                  <TableCell>{allocation.c4}</TableCell>
                  <TableCell>{allocation.c5}</TableCell>
                  <TableCell>{allocation.total}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEditProduction(allocation)} 
                      color="primary"
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteProduction(allocation.id)} 
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Consumption Table */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Consumption Allocation
          </Typography>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Site Name</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>C1 (Units)</TableCell>
                <TableCell>C2 (Units)</TableCell>
                <TableCell>C3 (Units)</TableCell>
                <TableCell>C4 (Units)</TableCell>
                <TableCell>C5 (Units)</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consumptionAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>{allocation.siteName}</TableCell>
                  <TableCell>{allocation.month}</TableCell>
                  <TableCell>{allocation.c1}</TableCell>
                  <TableCell>{allocation.c2}</TableCell>
                  <TableCell>{allocation.c3}</TableCell>
                  <TableCell>{allocation.c4}</TableCell>
                  <TableCell>{allocation.c5}</TableCell>
                  <TableCell>{allocation.total}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEditConsumption(allocation)} 
                      color="primary"
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteConsumption(allocation.id)} 
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Auto Allocate Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAutoAllocate}
            disabled={!productionAllocations.length || !consumptionAllocations.length}
            sx={{
              minWidth: 200,
              py: 1.5,
              fontSize: '1.1rem',
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Auto Allocate
          </Button>
        </Box>

        {/* Allocation Results Table */}
        {renderAllocationResults()}

        {/* Production Dialog */}
        <Dialog 
          open={openProductionDialog} 
          onClose={() => setOpenProductionDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingProduction ? 'Edit Production Data' : 'Add Production Data'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Month"
                    name="month"
                    value={newProduction.month}
                    onChange={(e) => setNewProduction({...newProduction, month: e.target.value})}
                  />
                </Grid>
                {['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={`${field.toUpperCase()} Production (Units)`}
                      name={field}
                      type="number"
                      value={newProduction[field]}
                      onChange={(e) => setNewProduction({...newProduction, [field]: e.target.value})}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProductionDialog(false)}>Cancel</Button>
            <Button onClick={handleProductionSubmit} color="primary" variant="contained">
              {editingProduction ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Consumption Dialog */}
        <Dialog 
          open={openConsumptionDialog} 
          onClose={() => setOpenConsumptionDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingConsumption ? 'Edit Consumption Data' : 'Add Consumption Data'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Month"
                    name="month"
                    value={newConsumption.month}
                    onChange={(e) => setNewConsumption({...newConsumption, month: e.target.value})}
                  />
                </Grid>
                {['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={`${field.toUpperCase()} Consumption (Units)`}
                      name={field}
                      type="number"
                      value={newConsumption[field]}
                      onChange={(e) => setNewConsumption({...newConsumption, [field]: e.target.value})}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConsumptionDialog(false)}>Cancel</Button>
            <Button onClick={handleConsumptionSubmit} color="primary" variant="contained">
              {editingConsumption ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Allocation;
