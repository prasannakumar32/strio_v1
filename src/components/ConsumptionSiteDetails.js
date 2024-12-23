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
  // ... same styles as ProductionSiteDetails
};

// Add this sample site data
const SAMPLE_SITE_INFO = {
  name: "Chennai Industrial Park",
  location: "Chennai, Tamil Nadu",
  type: "INDUSTRIAL",
  capacity: "10000",
  grid: "Tamil Nadu Grid",
  status: "active",
  banking: "Yes",
  serviceNumber: "TN45678/IND",
  companyName: "M/s Chennai Manufacturing Ltd"
};

// Add sample historical data
const SAMPLE_HISTORY_DATA = [
  { month: 'Feb', c1: 800, c2: 500, c3: 100, c4: 0, c5: 0, total: 1400 },
  { month: 'Mar', c1: 600, c2: 400, c3: 100, c4: 0, c5: 0, total: 1100 },
  { month: 'Apr', c1: 900, c2: 600, c3: 100, c4: 0, c5: 0, total: 1600 },
  { month: 'May', c1: 700, c2: 500, c3: 100, c4: 0, c5: 0, total: 1300 },
  { month: 'Jun', c1: 800, c2: 600, c3: 100, c4: 0, c5: 0, total: 1500 },
  { month: 'Nov', c1: 0, c2: 0, c3: 800, c4: 800, c5: 800, total: 2400 }
];

const ConsumptionSiteDetails = () => {
  const { siteId } = useParams();
  const { consumptionSites } = useSiteContext();
  const [site, setSite] = useState(null);
  const [chartType, setChartType] = useState('LINE_CHART');
  const [openForm, setOpenForm] = useState(false);
  const [consumptionHistory, setConsumptionHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [newData, setNewData] = useState({
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: ''
  });

  useEffect(() => {
    const loadSiteDetails = async () => {
      try {
        // First try to get site from context
        const contextSite = consumptionSites?.find(s => s.id === siteId);
        if (contextSite) {
          setSite(contextSite);
          localStorage.setItem('consumptionSites', JSON.stringify(consumptionSites));
        } else {
          // If not in context, use sample data
          const sampleSite = SAMPLE_SITES.find(s => s.id === siteId) || SAMPLE_SITE_INFO;
          setSite(sampleSite);
        }

        // Load from local storage as backup
        const storedSites = JSON.parse(localStorage.getItem('consumptionSites') || '[]');
        const storedSite = storedSites.find(s => s.id === siteId);
        if (storedSite && !contextSite) {
          setSite(storedSite);
        }

        // Load consumption history
        const key = `consumption_history_${siteId}`;
        const storedHistory = JSON.parse(localStorage.getItem(key) || 'null');
        if (!storedHistory) {
          setConsumptionHistory(SAMPLE_HISTORY_DATA);
          localStorage.setItem(key, JSON.stringify(SAMPLE_HISTORY_DATA));
        } else {
          setConsumptionHistory(storedHistory);
        }

        // Format data for chart
        const formattedData = storedHistory.map(record => ({
          month: record.month,
          Consumption: record.consumption,
          'Peak Demand': record.peakDemand,
          'Off Peak': record.offPeak,
          Renewable: record.renewable,
          Grid: record.grid
        }));
        setChartData(formattedData);

      } catch (err) {
        console.error('Error loading site data:', err);
      }
    };

    loadSiteDetails();
  }, [siteId, consumptionSites]);

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const renderChart = () => {
    const chartProps = {
      width: 700,
      height: 400,
      data: chartData,
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

    if (chartType === 'LINE_CHART') {
      return (
        <LineChart {...chartProps}>
          {commonComponents}
          <Line type="monotone" dataKey="Consumption" stroke="#8884d8" />
          <Line type="monotone" dataKey="Peak Demand" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Off Peak" stroke="#ffc658" />
          <Line type="monotone" dataKey="Renewable" stroke="#ff7300" />
          <Line type="monotone" dataKey="Grid" stroke="#ff0000" />
        </LineChart>
      );
    } else {
      return (
        <BarChart {...chartProps}>
          {commonComponents}
          <Bar dataKey="Consumption" fill="#8884d8" />
          <Bar dataKey="Peak Demand" fill="#82ca9d" />
          <Bar dataKey="Off Peak" fill="#ffc658" />
          <Bar dataKey="Renewable" fill="#ff7300" />
          <Bar dataKey="Grid" fill="#ff0000" />
        </BarChart>
      );
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setNewData({
      c1: record.c1 || '',
      c2: record.c2 || '',
      c3: record.c3 || '',
      c4: record.c4 || '',
      c5: record.c5 || ''
    });
    setOpenForm(true);
  };

  const handleDelete = (recordToDelete) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedHistory = consumptionHistory.filter(
        record => record.month !== recordToDelete.month
      );
      setConsumptionHistory(updatedHistory);
      localStorage.setItem(`consumption_history_${siteId}`, JSON.stringify(updatedHistory));
      
      // Update chart data
      const formattedData = updatedHistory.map(record => ({
        month: record.month,
        Consumption: record.consumption,
        'Peak Demand': record.peakDemand,
        'Off Peak': record.offPeak,
        Renewable: record.renewable,
        Grid: record.grid
      }));
      setChartData(formattedData);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const total = Object.values(newData)
      .filter(val => !isNaN(Number(val)))
      .reduce((sum, val) => sum + Number(val || 0), 0);

    // Update consumption history
    const newRecord = {
      month: new Date().toLocaleString('default', { month: 'short' }),
      ...newData,
      total
    };

    let updatedHistory;
    if (editingRecord) {
      updatedHistory = consumptionHistory.map(record =>
        record.month === editingRecord.month ? newRecord : record
      );
    } else {
      updatedHistory = [newRecord, ...consumptionHistory];
    }

    setConsumptionHistory(updatedHistory);
    localStorage.setItem(`consumption_history_${siteId}`, JSON.stringify(updatedHistory));

    // Also update allocation data
    const allocationEntry = {
      id: Date.now().toString(),
      userId: user.id,
      siteId: siteId,
      siteName: site?.name,
      date: new Date().toISOString(),
      month: newRecord.month,
      consumption: newData.consumption || 0,
      peakDemand: newData.peakDemand || 0,
      offPeak: newData.offPeak || 0,
      renewable: newData.renewable || 0,
      grid: newData.grid || 0,
      total: total
    };

    // Get existing allocations
    const existingAllocations = JSON.parse(localStorage.getItem(`consumptionAllocations_${user.id}`) || '[]');
    const updatedAllocations = [...existingAllocations, allocationEntry];
    localStorage.setItem(`consumptionAllocations_${user.id}`, JSON.stringify(updatedAllocations));

    handleCloseForm();
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingRecord(null);
    setNewData({
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: ''
    });
  };

  const renderFormDialog = () => {
    return (
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingRecord ? 'Edit Production Data' : 'Enter New Production Data'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Production Units
            </Typography>
            <Grid container spacing={3}>
              {/* C1 to C5 fields */}
              {Array.from({ length: 5 }, (_, i) => {
                const fieldName = `c${i + 1}`;
                return (
                  <Grid item xs={12} sm={6} key={fieldName}>
                    <TextField
                      fullWidth
                      label={`C${i + 1} Production (Units)`}
                      name={fieldName}
                      value={newData[fieldName]}
                      onChange={handleInputChange}
                      type="number"
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
          >
            {editingRecord ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderHistoryTable = () => {
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
            {consumptionHistory.map((record) => (
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
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box mt={3}>
          {/* Back Button and Title */}
          <Box display="flex" alignItems="center" mb={4}>
            <Link to="/consumption" style={{ textDecoration: 'none', color: 'inherit' }}>
              <IconButton color="primary" sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h4" component="h1">
              {site?.name} - Consumption Details
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
                      {site?.name || SAMPLE_SITE_INFO.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {site?.location || SAMPLE_SITE_INFO.location}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Type
                    </Typography>
                    <Typography variant="body1">
                      {site?.type || SAMPLE_SITE_INFO.type}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Capacity
                    </Typography>
                    <Typography variant="body1">
                      {site?.capacity || SAMPLE_SITE_INFO.capacity} units
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Grid
                    </Typography>
                    <Typography variant="body1">
                      {site?.grid || SAMPLE_SITE_INFO.grid}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: (site?.status || SAMPLE_SITE_INFO.status) === 'active' 
                          ? 'success.main' 
                          : 'error.main',
                        textTransform: 'capitalize'
                      }}
                    >
                      {site?.status || SAMPLE_SITE_INFO.status}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Banking
                    </Typography>
                    <Typography variant="body1">
                      {site?.banking || SAMPLE_SITE_INFO.banking}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Service Number/REC
                    </Typography>
                    <Typography variant="body1">
                      {site?.serviceNumber || SAMPLE_SITE_INFO.serviceNumber}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Company Name
                    </Typography>
                    <Typography variant="body1">
                      {site?.companyName || SAMPLE_SITE_INFO.companyName}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Right Side - Charts */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={styles.chartPaper}>
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
                    onClick={() => setOpenForm(true)}
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

            {/* Full Width Consumption History */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={styles.historyPaper}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="medium">
                    Production History
                  </Typography>
                </Box>
                {renderHistoryTable()}
              </Paper>
            </Grid>
          </Grid>

          {/* Add the form dialog */}
          {renderFormDialog()}
        </Box>
      </Container>
    </Layout>
  );
};

// You can also add more sample sites if needed
const SAMPLE_SITES = [
  {
    id: 'C1',
    name: "Chennai Industrial Park",
    location: "Chennai, Tamil Nadu",
    type: "INDUSTRIAL",
    capacity: "10000",
    grid: "Tamil Nadu Grid",
    status: "active",
    banking: "Yes",
    serviceNumber: "TN45678/IND",
    companyName: "M/s Chennai Manufacturing Ltd"
  },
  {
    id: 'C2',
    name: "Bangalore Tech Hub",
    location: "Bangalore, Karnataka",
    type: "COMMERCIAL",
    capacity: "8000",
    grid: "Karnataka Grid",
    status: "active",
    banking: "Yes",
    serviceNumber: "KA34567/COM",
    companyName: "M/s Bangalore Tech Solutions"
  },
  // Add more sample sites as needed
];

export default ConsumptionSiteDetails;
