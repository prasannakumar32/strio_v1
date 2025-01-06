import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import ProductionDataForm from './ProductionDataForm';
import mockData from '../testData/mockapi_production.json';

const siteData = {
  'CS1': {
    id: 'CS1',
    name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
    location: 'VIRUDUNAGAR',
    coordinates: '9.4533° N, 77.5262° E',
    grid: 'TANGEDCO',
    connectionType: 'HT',
    status: 'Active',
    type: 'CONSUMPTION',
    companyType: 'TEXTILE',
    capacity: '2000 KW',
    totalArea: '20000 sq.ft',
    serviceNumber: '079094620335'
  },
  'CS2': {
    id: 'CS2',
    name: 'PEL TEXTILES',
    location: 'VIRUDUNAGAR',
    coordinates: '9.4533° N, 77.5577° E',
    grid: 'TANGEDCO',
    connectionType: 'HT',
    status: 'Active',
    type: 'CONSUMPTION',
    companyType: 'TEXTILE',
    capacity: '1500 KW',
    totalArea: '15000 sq.ft',
    serviceNumber: '079094620348'
  },
  'CS3': {
    id: 'CS3',
    name: 'M/s Ramar and Sons',
    location: 'VIRUDUNAGAR',
    coordinates: '9.4533° N, 77.5577° E',
    grid: 'TANGEDCO',
    connectionType: 'HT',
    status: 'Active',
    type: 'CONSUMPTION',
    companyType: 'TEXTILE',
    capacity: '1800 KW',
    totalArea: '18000 sq.ft',
    serviceNumber: '079094620349'
  }
};

const ConsumptionSiteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chartType, setChartType] = useState('line');
  const [openForm, setOpenForm] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState(null);
  const [error, setError] = useState(null);
  
  const site = siteData[id];

  useEffect(() => {
    const loadSiteData = async () => {
      if (!id) {
        setError('Site ID is required');
        setLoading(false);
        return;
      }

      if (!site) {
        setError(`Consumption site not found. Site ID: ${id}`);
        setLoading(false);
        return;
      }

      // Validate site type
      if (site.type !== 'CONSUMPTION') {
        navigate(`/production/${id}`, { replace: true });
        return;
      }

      try {
        setLoading(true);
        
        // Get current date and calculate last 3 months
        const currentDate = new Date('2025-01-06T14:23:59+05:30');
        const months = [];
        for (let i = 0; i < 3; i++) {
          const date = new Date(currentDate);
          date.setMonth(currentDate.getMonth() - i);
          months.unshift(date.toISOString().slice(0, 7)); // Format: YYYY-MM
        }

        // Create data for last 3 months
        const defaultData = months.map((month, index) => {
          // Base values that increase each month
          const baseValues = {
            C1: 236 + (index * 15),
            C2: 286 + (index * 15),
            C3: 258 + (index * 17),
            C4: 309 + (index * 17),
            C5: 265 + (index * 15)
          };

          return {
            month_year: month,
            ...baseValues,
            site_id: id
          };
        });

        // Sort by date (oldest to newest)
        const formattedData = defaultData.map(item => ({
          month: item.month_year,
          c1: Math.round(item.C1),
          c2: Math.round(item.C2),
          c3: Math.round(item.C3),
          c4: Math.round(item.C4),
          c5: Math.round(item.C5)
        }));

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setHistoricalData(formattedData);
        setError(null);
      } catch (err) {
        setError(`Error loading site data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSiteData();
  }, [id, site, navigate]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="h6" color="textSecondary">
          Loading consumption site data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="60vh"
        gap={2}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            textAlign: 'center', 
            backgroundColor: '#fff3f3',
            maxWidth: 400
          }}
        >
          <ErrorOutline 
            color="error" 
            sx={{ fontSize: 48, mb: 2 }} 
          />
          <Typography 
            variant="h6" 
            color="error" 
            gutterBottom
          >
            Error
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
          >
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/consumption')}
            startIcon={<ArrowBack />}
          >
            Back to Consumption Sites
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleEdit = (data) => {
    setSelectedData(data);
    setOpenForm(true);
  };

  const handleDelete = (month) => {
    // Implement delete functionality
    console.log('Delete:', month);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedData(null);
  };

  const handleFormSubmit = (formData) => {
    // Implement form submit functionality
    console.log('Form submitted:', formData);
    setOpenForm(false);
    setSelectedData(null);
  };

  return (
    <Container maxWidth="xl">
      {/* Back Button */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate('/consumption')}
          startIcon={<ArrowBack />}
          sx={{ 
            color: '#1a237e',
            '&:hover': {
              backgroundColor: 'rgba(26, 35, 126, 0.04)'
            }
          }}
        >
          BACK TO CONSUMPTION SITES
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
        {site.name}
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
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={site.location}
                  secondary={site.coordinates}
                />
              </ListItem>

              {/* Grid & Connection */}
              <ListItem>
                <ListItemIcon>
                  <Power color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Grid & Connection"
                  secondary={`Grid: ${site.grid}\nConnection Type: ${site.connectionType}`}
                />
              </ListItem>

              {/* Status & Type */}
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Status & Type"
                  secondary={`Status: ${site.status}\nType: ${site.type}\nCompany Type: ${site.companyType}`}
                />
              </ListItem>

              {/* Capacity & Area */}
              <ListItem>
                <ListItemIcon>
                  <Speed color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Capacity & Area"
                  secondary={
                    <>
                      Capacity: {site.capacity}<br />
                      Total Area: {site.totalArea}<br />
                      Service Number: {site.serviceNumber}
                    </>
                  }
                />
              </ListItem>

              {/* Service Information */}
              <ListItem>
                <ListItemIcon>
                  <Assignment color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Service Information"
                  secondary={
                    <>
                      Service Number: {site.serviceNumber}<br />
                    </>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right Column - Chart and Data */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Button
                  variant={chartType === 'line' ? 'contained' : 'outlined'}
                  onClick={() => setChartType('line')}
                  sx={{ mr: 1 }}
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenForm(true)}
              >
                + ENTER NEW DATA
              </Button>
            </Box>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                {chartType === 'line' ? (
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="c1" stroke="#8884d8" name="C1" dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="c2" stroke="#82ca9d" name="C2" dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="c3" stroke="#ffc658" name="C3" dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="c4" stroke="#ff7300" name="C4" dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="c5" stroke="#ff0000" name="C5" dot={{ r: 6 }} />
                  </LineChart>
                ) : (
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Bar dataKey="c1" fill="#8884d8" name="C1" />
                    <Bar dataKey="c2" fill="#82ca9d" name="C2" />
                    <Bar dataKey="c3" fill="#ffc658" name="C3" />
                    <Bar dataKey="c4" fill="#ff7300" name="C4" />
                    <Bar dataKey="c5" fill="#ff0000" name="C5" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Historical Data Table */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Historical Data
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>C1</TableCell>
                    <TableCell>C2</TableCell>
                    <TableCell>C3</TableCell>
                    <TableCell>C4</TableCell>
                    <TableCell>C5</TableCell>
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
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEdit(row)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(row.month)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Entry Form Dialog */}
      {openForm && (
        <ProductionDataForm
          open={openForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={selectedData}
        />
      )}
    </Container>
  );
};

export default ConsumptionSiteDetails;
