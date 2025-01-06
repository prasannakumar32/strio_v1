import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  LocationOn,
  Business,
  Power,
  Speed,
  Assignment,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ErrorOutline,
  ArrowBack,
  CheckCircle
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  ResponsiveContainer 
} from 'recharts';
import ProductionDataForm from './ProductionDataForm';

const siteData = {
  'PS1': {
    id: 'PUDUKOTTAI',
    name: 'Pudukottai Solar',
    location: 'Pudukottai',
    coordinates: '10.3789° N, 78.8243° E',
    grid: 'TANGEDCO',
    connectionType: 'HT',
    status: 'Active',
    type: 'SOLAR',
    companyType: 'RENEWABLE',
    capacity: '1000 MW',
    totalArea: '500 acres',
    panelType: 'Monocrystalline',
    inverterCapacity: '1000 KW',
    transformerCapacity: '1000 KVA',
    serviceNumber: '069534460069'
  },
  'PW1': {
    id: 'TIRUNELVELI',
    name: 'Tirunelveli Wind',
    location: 'Tirunelveli',
    coordinates: '8.2574° N, 77.6127° E',
    grid: 'TANGEDCO',
    connectionType: 'HT',
    status: 'Active',
    type: 'WIND',
    companyType: 'RENEWABLE',
    capacity: '600 MW',
    totalArea: '300 acres',
    turbineType: 'Horizontal Axis',
    inverterCapacity: '600 KW',
    transformerCapacity: '600 KVA',
    serviceNumber: '079204721131'
  }
};

const mockHistoricalData = {
  'PS1': [
    {
      month: '2025-01',
      C1: 42000,
      C2: 0,
      C3: 0,
      C4: 118000,
      C5: 0,
      total: 160000
    },
    {
      month: '2024-12',
      C1: 41000,
      C2: 0,
      C3: 0,
      C4: 115000,
      C5: 0,
      total: 156000
    },
    {
      month: '2024-11',
      C1: 40000,
      C2: 0,
      C3: 0,
      C4: 112000,
      C5: 0,
      total: 152000
    }
  ],
  'PW1': [
    {
      month: '2025-01',
      C1: 11500,
      C2: 15500,
      C3: 0,
      C4: 46000,
      C5: 23000,
      total: 96000
    },
    {
      month: '2024-12',
      C1: 11000,
      C2: 15000,
      C3: 0,
      C4: 45000,
      C5: 22000,
      total: 93000
    },
    {
      month: '2024-11',
      C1: 10500,
      C2: 14500,
      C3: 0,
      C4: 44000,
      C5: 21000,
      total: 90000
    }
  ]
};

const ProductionSiteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState('line');
  const [openForm, setOpenForm] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Site ID is required');
      setLoading(false);
      return;
    }

    const site = siteData[id];
    if (!site) {
      setError(`Site not found: ${id}`);
      setLoading(false);
      return;
    }

    // Load historical data
    const data = mockHistoricalData[id] || [];
    setHistoricalData(data);
    setLoading(false);
  }, [id]);

  const formatMonthDisplay = (monthStr) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const renderChart = () => {
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!historicalData.length) return <Typography>No historical data available</Typography>;

    const chartHeight = 400;
    
    return (
      <Box sx={{ width: '100%', height: chartHeight, mt: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button
            variant={chartType === 'line' ? 'contained' : 'outlined'}
            onClick={() => setChartType('line')}
          >
            LINE CHART
          </Button>
          <Button
            variant={chartType === 'bar' ? 'contained' : 'outlined'}
            onClick={() => setChartType('bar')}
          >
            BAR CHART
          </Button>
        </Box>
        
        <ResponsiveContainer>
          {chartType === 'line' ? (
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={formatMonthDisplay} />
              <YAxis />
              <Tooltip 
                labelFormatter={formatMonthDisplay}
                formatter={(value) => [`${value.toLocaleString()} KWh`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="C1" stroke="#8884d8" name="C1" />
              <Line type="monotone" dataKey="C2" stroke="#82ca9d" name="C2" />
              <Line type="monotone" dataKey="C3" stroke="#ffc658" name="C3" />
              <Line type="monotone" dataKey="C4" stroke="#ff7300" name="C4" />
              <Line type="monotone" dataKey="C5" stroke="#ff0000" name="C5" />
            </LineChart>
          ) : (
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={formatMonthDisplay} />
              <YAxis />
              <Tooltip 
                labelFormatter={formatMonthDisplay}
                formatter={(value) => [`${value.toLocaleString()} KWh`, '']}
              />
              <Legend />
              <Bar dataKey="C1" fill="#8884d8" name="C1" />
              <Bar dataKey="C2" fill="#82ca9d" name="C2" />
              <Bar dataKey="C3" fill="#ffc658" name="C3" />
              <Bar dataKey="C4" fill="#ff7300" name="C4" />
              <Bar dataKey="C5" fill="#ff0000" name="C5" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderHistoricalTable = () => {
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!historicalData.length) return <Typography>No historical data available</Typography>;

    return (
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell align="right">C1</TableCell>
              <TableCell align="right">C2</TableCell>
              <TableCell align="right">C3</TableCell>
              <TableCell align="right">C4</TableCell>
              <TableCell align="right">C5</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicalData.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{formatMonthDisplay(row.month)}</TableCell>
                <TableCell align="right">{row.C1.toLocaleString()}</TableCell>
                <TableCell align="right">{row.C2.toLocaleString()}</TableCell>
                <TableCell align="right">{row.C3.toLocaleString()}</TableCell>
                <TableCell align="right">{row.C4.toLocaleString()}</TableCell>
                <TableCell align="right">{row.C5.toLocaleString()}</TableCell>
                <TableCell align="right">{row.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleEdit = (data) => {
    setSelectedData(data);
    setOpenForm(true);
  };

  const handleSubmit = (formData) => {
    const newEntry = {
      month: formData.month,
      C1: Math.round(parseFloat(formData.C1)),
      C2: Math.round(parseFloat(formData.C2)),
      C3: Math.round(parseFloat(formData.C3)),
      C4: Math.round(parseFloat(formData.C4)),
      C5: Math.round(parseFloat(formData.C5)),
      total: Math.round(parseFloat(formData.total))
    };

    // Update mock data
    const updatedMockData = [...mockHistoricalData[id]];
    const index = updatedMockData.findIndex(
      item => item.month === formData.month
    );

    if (index !== -1) {
      updatedMockData[index] = {
        ...updatedMockData[index],
        C1: newEntry.C1,
        C2: newEntry.C2,
        C3: newEntry.C3,
        C4: newEntry.C4,
        C5: newEntry.C5,
        total: newEntry.total
      };
    } else {
      updatedMockData.push({
        month: formData.month,
        C1: newEntry.C1,
        C2: newEntry.C2,
        C3: newEntry.C3,
        C4: newEntry.C4,
        C5: newEntry.C5,
        total: newEntry.total
      });
    }

    // Update state
    setHistoricalData(updatedMockData);

    setSelectedData(null);
    setOpenForm(false);
  };

  const handleDelete = (month) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      // Remove from mock data
      const updatedMockData = mockHistoricalData[id].filter(
        item => item.month !== month
      );

      // Update state
      setHistoricalData(updatedMockData);
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Back Button */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate('/production')}
          startIcon={<ArrowBack />}
          sx={{ 
            color: '#1a237e',
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.04)'
            }
          }}
        >
          BACK TO PRODUCTION SITES
        </Button>
      </Box>

      {/* Site Name Header */}
      <Typography 
        variant="h5" 
        component="h1" 
        sx={{ 
          mb: 3,
          fontWeight: 500,
          color: '#1a237e'
        }}
      >
        {siteData[id].name}
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column - Site Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                mb: 3,
                color: '#1a237e',
                fontWeight: 500
              }}
            >
              Site Information
            </Typography>

            <List>
              {/* Location */}
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" sx={{ mt: 0.5 }} />
                </ListItemIcon>
                <ListItemText primary={siteData[id].location} secondary={siteData[id].coordinates} />
              </ListItem>

              {/* Grid & Connection */}
              <ListItem>
                <ListItemIcon>
                  <Power color="primary" sx={{ mt: 0.5 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Grid & Connection" 
                  secondary={
                    <Box>
                      <Typography variant="body2">Grid: {siteData[id].grid}</Typography>
                      <Typography variant="body2">Connection Type: {siteData[id].connectionType}</Typography>
                    </Box>
                  } 
                />
              </ListItem>

              {/* Status & Type */}
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" sx={{ mt: 0.5 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Status & Type" 
                  secondary={
                    <Box>
                      <Typography variant="body2">Status: {siteData[id].status}</Typography>
                      <Typography variant="body2">Type: {siteData[id].type}</Typography>
                      <Typography variant="body2">Company Type: {siteData[id].companyType}</Typography>
                    </Box>
                  } 
                />
              </ListItem>

              {/* Capacity & Area */}
              <ListItem>
                <ListItemIcon>
                  <Speed color="primary" sx={{ mt: 0.5 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Capacity & Area" 
                  secondary={
                    <Box>
                      <Typography variant="body2">Capacity: {siteData[id].capacity}</Typography>
                      <Typography variant="body2">Total Area: {siteData[id].totalArea}</Typography>
                      {siteData[id].type === 'SOLAR' ? (
                        <Typography variant="body2">Panel Type: {siteData[id].panelType}</Typography>
                      ) : siteData[id].type === 'WIND' ? (
                        <Typography variant="body2">Turbine Type: {siteData[id].turbineType}</Typography>
                      ) : (
                        <></>
                      )}
                    </Box>
                  } 
                />
              </ListItem>

              {/* Service Information */}
              <ListItem>
                <ListItemIcon>
                  <Assignment color="primary" sx={{ mt: 0.5 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Service Information" 
                  secondary={
                    <Box>
                      <Typography variant="body2">Service Number: {siteData[id].serviceNumber}</Typography>
                      <Typography variant="body2">Commission Date: {siteData[id].commissionDate || '-'}</Typography>
                      <Typography variant="body2">Last Inspection: {siteData[id].lastInspection || '-'}</Typography>
                      <Typography variant="body2">Maintenance: {siteData[id].maintenance || '-'}</Typography>
                    </Box>
                  } 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Chart and Data */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {renderChart()}
            {renderHistoricalTable()}
          </Paper>
        </Grid>
      </Grid>

      <ProductionDataForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedData(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedData}
      />
    </Container>
  );
};

export default ProductionSiteDetails;
