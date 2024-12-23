import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteContext } from '../context/SiteContext';
import Layout from './Layout';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const styles = {
  tableContainer: {
    mt: 4,
    '& .MuiTableCell-head': {
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
      whiteSpace: 'nowrap'
    },
    '& .MuiTableCell-root': {
      padding: '16px',
      textAlign: 'center'
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  actionButtons: {
    display: 'flex',
    gap: 1,
    justifyContent: 'center'
  },
  historyPaper: {
    p: 3,
    mt: 4,
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  tableWrapper: {
    flex: 1,
    overflow: 'auto',
    minHeight: 300,
    maxHeight: '500px'
  },
  chartPaper: {
    p: 3,
    mb: 4
  },
  fullWidthSection: {
    width: '100%',
    mt: 4
  }
};

const ProductionSiteDetails = () => {
  const { siteId } = useParams();
  const { productionSites } = useSiteContext();
  const [site, setSite] = useState(null);
  const [activeTab, setActiveTab] = useState('PRODUCTION_METRICS');
  const [chartType, setChartType] = useState('LINE_CHART');
  const [openForm, setOpenForm] = useState(false);
  const [productionHistory, setProductionHistory] = useState([
    { 
      month: 'Feb', 
      c1: 800, c2: 500, c3: 100, c4: 0, c5: 0,
      c001: 100, c002: 200, c003: 300, c004: 400, c005: 500, c006: 600, c007: 700, c008: 800,
      total: 1400 
    },
    { 
      month: 'Mar', 
      c1: 600, c2: 400, c3: 100, c4: 0, c5: 0,
      c001: 150, c002: 250, c003: 350, c004: 450, c005: 550, c006: 650, c007: 750, c008: 850,
      total: 1100 
    },
    { month: 'Apr', c1: 900, c2: 600, c3: 100, c4: 0, c5: 0, total: 1600 },
    { month: 'May', c1: 700, c2: 500, c3: 100, c4: 0, c5: 0, total: 1300 },
    { month: 'Jun', c1: 800, c2: 600, c3: 100, c4: 0, c5: 0, total: 1500 },
    { month: 'Nov', c1: 0, c2: 0, c3: 800, c4: 800, c5: 800, total: 2400 },
  ]);
  const [newProduction, setNewProduction] = useState({
    c1: '', c2: '', c3: '', c4: '', c5: '',
    c001: '', c002: '', c003: '', c004: '', c005: '', c006: '', c007: '', c008: ''
  });
  const [editingRecord, setEditingRecord] = useState(null);
  const [productionChartData, setProductionChartData] = useState([]);
  const [chargeMatrixChartData, setChargeMatrixChartData] = useState([]);

  // Update the chart data when production history changes
  useEffect(() => {
    const formatChartData = () => {
      return productionHistory.map(record => ({
        month: record.month,
        // For Production Metrics
        C1: record.c1,
        C2: record.c2,
        C3: record.c3,
        C4: record.c4,
        C5: record.c5,
        // For Charge Metrics
        C001: record.c001,
        C002: record.c002,
        C003: record.c003,
        C004: record.c004,
        C005: record.c005,
        C006: record.c006,
        C007: record.c007,
        C008: record.c008
      }));
    };

    const formattedData = formatChartData();
    setProductionChartData(formattedData);
    setChargeMatrixChartData(formattedData);
  }, [productionHistory]);

  // Function to render the appropriate chart based on active tab
  const renderChart = () => {
    const chartProps = {
      width: 700,
      height: 400,
      data: activeTab === 'PRODUCTION_METRICS' ? productionChartData : chargeMatrixChartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const commonComponents = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
      </>
    );

    if (activeTab === 'PRODUCTION_METRICS') {
      if (chartType === 'LINE_CHART') {
        return (
          <LineChart {...chartProps}>
            {commonComponents}
            <Line type="monotone" dataKey="C1" stroke="#8884d8" />
            <Line type="monotone" dataKey="C2" stroke="#82ca9d" />
            <Line type="monotone" dataKey="C3" stroke="#ffc658" />
            <Line type="monotone" dataKey="C4" stroke="#ff7300" />
            <Line type="monotone" dataKey="C5" stroke="#ff0000" />
          </LineChart>
        );
      } else {
        return (
          <BarChart {...chartProps}>
            {commonComponents}
            <Bar dataKey="C1" fill="#8884d8" />
            <Bar dataKey="C2" fill="#82ca9d" />
            <Bar dataKey="C3" fill="#ffc658" />
            <Bar dataKey="C4" fill="#ff7300" />
            <Bar dataKey="C5" fill="#ff0000" />
          </BarChart>
        );
      }
    } else {
      if (chartType === 'LINE_CHART') {
        return (
          <LineChart {...chartProps}>
            {commonComponents}
            <Line type="monotone" dataKey="C001" stroke="#8884d8" />
            <Line type="monotone" dataKey="C002" stroke="#82ca9d" />
            <Line type="monotone" dataKey="C003" stroke="#ffc658" />
            <Line type="monotone" dataKey="C004" stroke="#ff7300" />
            <Line type="monotone" dataKey="C005" stroke="#ff0000" />
            <Line type="monotone" dataKey="C006" stroke="#0088FE" />
            <Line type="monotone" dataKey="C007" stroke="#00C49F" />
            <Line type="monotone" dataKey="C008" stroke="#FFBB28" />
          </LineChart>
        );
      } else {
        return (
          <BarChart {...chartProps}>
            {commonComponents}
            <Bar dataKey="C001" fill="#8884d8" />
            <Bar dataKey="C002" fill="#82ca9d" />
            <Bar dataKey="C003" fill="#ffc658" />
            <Bar dataKey="C004" fill="#ff7300" />
            <Bar dataKey="C005" fill="#ff0000" />
            <Bar dataKey="C006" fill="#0088FE" />
            <Bar dataKey="C007" fill="#00C49F" />
            <Bar dataKey="C008" fill="#FFBB28" />
          </BarChart>
        );
      }
    }
  };

  useEffect(() => {
    const loadSiteDetails = () => {
      const foundSite = productionSites?.find(s => s.id === siteId);
      if (foundSite) {
        setSite(foundSite);
        localStorage.setItem('productionSites', JSON.stringify(productionSites));
      } else {
        // Try loading from localStorage
        const storedSites = JSON.parse(localStorage.getItem('productionSites') || '[]');
        const storedSite = storedSites.find(s => s.id === siteId);
        if (storedSite) {
          setSite(storedSite);
        }
      }
    };

    loadSiteDetails();
  }, [siteId, productionSites]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingRecord(null);
    setNewProduction({
      c1: '', c2: '', c3: '', c4: '', c5: '',
      c001: '', c002: '', c003: '', c004: '', c005: '', c006: '', c007: '', c008: ''
    });
  };

  const handleProductionInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewProduction({
      c1: record.c1 || '',
      c2: record.c2 || '',
      c3: record.c3 || '',
      c4: record.c4 || '',
      c5: record.c5 || '',
      c001: record.c001 || '',
      c002: record.c002 || '',
      c003: record.c003 || '',
      c004: record.c004 || '',
      c005: record.c005 || '',
      c006: record.c006 || '',
      c007: record.c007 || '',
      c008: record.c008 || ''
    });
    setOpenForm(true);
  };

  const handleDelete = (recordToDelete) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setProductionHistory(prev => 
        prev.filter(record => record.month !== recordToDelete.month)
      );
      
      // Update localStorage
      const key = `production_history_${siteId}`;
      const updatedHistory = productionHistory.filter(
        record => record.month !== recordToDelete.month
      );
      localStorage.setItem(key, JSON.stringify(updatedHistory));
    }
  };

  const handleSubmitProduction = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const total = Object.values(newProduction)
      .filter(val => !isNaN(Number(val)))
      .reduce((sum, val) => sum + Number(val || 0), 0);

    // Update production history
    const newRecord = {
      month: new Date().toLocaleString('default', { month: 'short' }),
      ...newProduction,
      total
    };

    let updatedHistory;
    if (editingRecord) {
      updatedHistory = productionHistory.map(record =>
        record.month === editingRecord.month ? newRecord : record
      );
    } else {
      updatedHistory = [newRecord, ...productionHistory];
    }

    setProductionHistory(updatedHistory);
    localStorage.setItem(`production_history_${siteId}`, JSON.stringify(updatedHistory));

    // Also update allocation data
    const allocationEntry = {
      id: Date.now().toString(),
      userId: user.id,
      siteId: siteId,
      siteName: site?.name,
      date: new Date().toISOString(),
      month: newRecord.month,
      c1: newProduction.c1 || 0,
      c2: newProduction.c2 || 0,
      c3: newProduction.c3 || 0,
      c4: newProduction.c4 || 0,
      c5: newProduction.c5 || 0,
      total: total
    };

    // Get existing allocations
    const existingAllocations = JSON.parse(localStorage.getItem(`productionAllocations_${user.id}`) || '[]');
    const updatedAllocations = [...existingAllocations, allocationEntry];
    localStorage.setItem(`productionAllocations_${user.id}`, JSON.stringify(updatedAllocations));

    handleCloseForm();
  };

  // Render different tables based on active tab
  const renderTable = () => {
    if (activeTab === 'PRODUCTION_METRICS') {
      return (
        <TableContainer sx={styles.tableWrapper}>
          <Table stickyHeader>
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
              {productionHistory.map((record) => (
                <TableRow key={record.month} hover>
                  <TableCell>{record.month}</TableCell>
                  <TableCell>{record.c1}</TableCell>
                  <TableCell>{record.c2}</TableCell>
                  <TableCell>{record.c3}</TableCell>
                  <TableCell>{record.c4}</TableCell>
                  <TableCell>{record.c5}</TableCell>
                  <TableCell>{record.total}</TableCell>
                  <TableCell>
                    <Box sx={styles.actionButtons}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEdit(record)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(record)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return (
        <TableContainer sx={styles.tableWrapper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>C001</TableCell>
                <TableCell>C002</TableCell>
                <TableCell>C003</TableCell>
                <TableCell>C004</TableCell>
                <TableCell>C005</TableCell>
                <TableCell>C006</TableCell>
                <TableCell>C007</TableCell>
                <TableCell>C008</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productionHistory.map((record) => (
                <TableRow key={record.month} hover>
                  <TableCell>{record.month}</TableCell>
                  <TableCell>{record.c001}</TableCell>
                  <TableCell>{record.c002}</TableCell>
                  <TableCell>{record.c003}</TableCell>
                  <TableCell>{record.c004}</TableCell>
                  <TableCell>{record.c005}</TableCell>
                  <TableCell>{record.c006}</TableCell>
                  <TableCell>{record.c007}</TableCell>
                  <TableCell>{record.c008}</TableCell>
                  <TableCell>
                    <Box sx={styles.actionButtons}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEdit(record)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(record)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  };

  // Update the renderFormFields function
  const renderFormFields = () => {
    if (activeTab === 'PRODUCTION_METRICS') {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Production Units
            </Typography>
          </Grid>
          {Array.from({ length: 5 }, (_, i) => {
            const fieldName = `c${i + 1}`;
            return (
              <Grid item xs={12} sm={6} key={fieldName}>
                <TextField
                  fullWidth
                  label={`C${i + 1} Production (Units)`}
                  name={fieldName}
                  value={newProduction[fieldName]}
                  onChange={handleProductionInputChange}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
            );
          })}
        </>
      );
    } else {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Charge Matrix Units
            </Typography>
          </Grid>
          {Array.from({ length: 8 }, (_, i) => {
            const fieldName = `c00${i + 1}`;
            return (
              <Grid item xs={12} sm={6} key={fieldName}>
                <TextField
                  fullWidth
                  label={`C00${i + 1} Charge Matrix`}
                  name={fieldName}
                  value={newProduction[fieldName]}
                  onChange={handleProductionInputChange}
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>
            );
          })}
        </>
      );
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box mt={3}>
          {/* Back Button and Title */}
          <Box display="flex" alignItems="center" mb={4}>
            <Link to="/production" style={{ textDecoration: 'none', color: 'inherit' }}>
              <IconButton color="primary" sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h4" component="h1">
              {site?.name} - Production Details
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Left Side - Site Information */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Site Information
                </Typography>
                <Box sx={{ '& > div': { mb: 2 } }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Site
                    </Typography>
                    <Typography variant="body1">
                      {site?.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {site?.location}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Capacity
                    </Typography>
                    <Typography variant="body1">
                      {site?.capacity} units
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Grid
                    </Typography>
                    <Typography variant="body1">
                      {site?.grid}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Typography variant="body1" color={site?.status === 'active' ? 'success.main' : 'error.main'}>
                      {site?.status}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Banking
                    </Typography>
                    <Typography variant="body1">
                      {site?.banking ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Service Number/REC
                    </Typography>
                    <Typography variant="body1">
                      {site?.serviceNumber}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Company Name
                    </Typography>
                    <Typography variant="body1">
                      {site?.companyName}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Right Side - Charts */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={styles.chartPaper}>
                {/* Metrics Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Production Metrics" value="PRODUCTION_METRICS" />
                    <Tab label="Charges Metrics" value="CHARGES_METRICS" />
                  </Tabs>
                </Box>

                {/* Chart Type Buttons */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Button
                      variant={chartType === 'LINE_CHART' ? 'contained' : 'outlined'}
                      onClick={() => handleChartTypeChange('LINE_CHART')}
                      sx={{ mr: 2 }}
                    >
                      Line Chart
                    </Button>
                    <Button
                      variant={chartType === 'BAR_CHART' ? 'contained' : 'outlined'}
                      onClick={() => handleChartTypeChange('BAR_CHART')}
                    >
                      Bar Chart
                    </Button>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleOpenForm}
                    startIcon={<AddIcon />}
                  >
                    Enter New Data
                  </Button>
                </Box>

                {/* Chart */}
                <Box sx={{ width: '100%', height: 400, overflowX: 'auto' }}>
                  {renderChart()}
                </Box>
              </Paper>
            </Grid>

            {/* Full Width Production History */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={styles.historyPaper}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="medium">
                    {activeTab === 'PRODUCTION_METRICS' ? 'Production History' : 'Charge Matrices'}
                  </Typography>
                </Box>
                {renderTable()}
              </Paper>
            </Grid>
          </Grid>

          {/* Dialog */}
          <Dialog 
            open={openForm} 
            onClose={handleCloseForm} 
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {editingRecord 
                ? `Edit ${activeTab === 'PRODUCTION_METRICS' ? 'Production' : 'Charge Matrix'} Data` 
                : `Enter New ${activeTab === 'PRODUCTION_METRICS' ? 'Production' : 'Charge Matrix'} Data`
              }
            </DialogTitle>
            <DialogContent>
              <Box sx={{ p: 1 }}>
                <Grid container spacing={3}>
                  {renderFormFields()}
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
              <Button onClick={handleCloseForm}>Cancel</Button>
              <Button 
                onClick={handleSubmitProduction} 
                variant="contained" 
                color="primary"
              >
                {editingRecord ? 'Update' : 'Submit'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Layout>
  );
};

export default ProductionSiteDetails; 