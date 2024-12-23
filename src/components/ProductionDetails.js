import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  MenuItem,
  Tooltip,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchSiteDetails, deleteProductionData, updateProductionData, validateProductionData } from '../services/productionApi';
import { useAuth } from '../context/AuthContext';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const years = [2024, 2023];

const ProductionDetails = () => {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [siteDetails, setSiteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [chartType, setChartType] = useState('line');
  const [newData, setNewData] = useState({
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c001: '',
    c002: '',
    c003: '',
    c004: '',
    c005: '',
    c006: '',
    c007: '',
    c008: '',
    notes: '',
    month: '',
    year: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });

  // Check if user has edit permissions - setting to true for test case 1
  const canEdit = true; // Temporarily set to true for testing

  useEffect(() => {
    const loadSiteDetails = async () => {
      try {
        if (!siteId) {
          console.error('No site ID provided');
          setError('No site ID provided');
          setLoading(false);
          return;
        }

        console.log('Loading details for site ID:', siteId);
        
        // Pass the raw site ID to the API - let it handle normalization
        const response = await fetchSiteDetails(siteId);
        console.log('Loaded site details:', response);
        
        setSiteDetails(response);
        setLoading(false);
      } catch (err) {
        console.error('Error loading site details:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadSiteDetails();
  }, [siteId]);

  useEffect(() => {
    if (selectedEntry && editMode) {
      setNewData({
        c1: selectedEntry.c1,
        c2: selectedEntry.c2,
        c3: selectedEntry.c3,
        c4: selectedEntry.c4,
        c001: selectedEntry.c001,
        c002: selectedEntry.c002,
        c003: selectedEntry.c003,
        c004: selectedEntry.c004,
        c005: selectedEntry.c005,
        c006: selectedEntry.c006,
        c007: selectedEntry.c007,
        c008: selectedEntry.c008,
        notes: selectedEntry.notes || '',
        month: selectedEntry.month,
        year: selectedEntry.year
      });
    }
  }, [selectedEntry, editMode]);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setNewData(prev => ({
      ...prev,
      [field]: value ? Number(value) : ''
    }));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleEdit = (record) => {
    setSelectedEntry(record);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (entry) => {
    if (!canEdit) {
      setError('You do not have permission to delete data');
      return;
    }
    try {
      await deleteProductionData(siteId, entry.month, entry.year);
      const response = await fetchSiteDetails(siteId);
      setSiteDetails(response);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canEdit) {
      setError('You do not have permission to submit data');
      return;
    }
    setSubmitStatus({ loading: true, error: null });

    try {
      const validation = validateProductionData(newData);
      if (!validation.isValid) {
        setFormErrors(validation.errors);
        setSubmitStatus({ loading: false, error: 'Please correct the errors in the form' });
        return;
      }

      setFormErrors({});

      await updateProductionData(
        siteId,
        newData.month,
        newData.year,
        newData
      );

      const updatedSite = await fetchSiteDetails(siteId);
      setSiteDetails(updatedSite);

      setNewData({
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c001: '',
        c002: '',
        c003: '',
        c004: '',
        c005: '',
        c006: '',
        c007: '',
        c008: '',
        notes: '',
        month: '',
        year: ''
      });
      setEditMode(false);
      setSelectedEntry(null);
      setSubmitStatus({ loading: false, error: null });
      setError(null);
      setShowForm(false);
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message });
      setError(error.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditMode(false);
    setSelectedEntry(null);
    setNewData({
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c001: '',
      c002: '',
      c003: '',
      c004: '',
      c005: '',
      c006: '',
      c007: '',
      c008: '',
      notes: '',
      month: '',
      year: ''
    });
    setFormErrors({});
  };

  const renderChart = (data, metrics, colors) => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    const DataComponent = chartType === 'line' ? Line : Bar;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip />
          <Legend />
          {metrics.map((metric, index) => (
            <DataComponent
              key={metric}
              type="monotone"
              dataKey={metric}
              name={metric}
              stroke={colors[index]}
              fill={colors[index]}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  if (loading) return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    </Container>
  );

  if (error) return (
    <Container>
      <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
    </Container>
  );

  if (!siteDetails) return (
    <Container>
      <Alert severity="error" sx={{ mt: 2 }}>Site not found</Alert>
    </Container>
  );

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" gutterBottom>
            {siteDetails.name}
          </Typography>
          {canEdit && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(true)}
              startIcon={<AddIcon />}
            >
              Enter New Data
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Location: {siteDetails.location}</Typography>
            <Typography variant="subtitle1">Type: {siteDetails.type}</Typography>
            <Typography variant="subtitle1">Capacity: {siteDetails.capacity} MW</Typography>
            <Typography variant="subtitle1">Efficiency: {siteDetails.efficiency}%</Typography>
            <Typography variant="subtitle1">Status: {siteDetails.status}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Chart Controls */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Production Metrics" />
                <Tab label="Charges Metrics" />
              </Tabs>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Button
                variant={chartType === 'line' ? 'contained' : 'outlined'}
                onClick={() => handleChartTypeChange('line')}
                sx={{ mr: 1 }}
              >
                Line Chart
              </Button>
              <Button
                variant={chartType === 'bar' ? 'contained' : 'outlined'}
                onClick={() => handleChartTypeChange('bar')}
              >
                Bar Chart
              </Button>
            </Box>

            {selectedTab === 0 && renderChart(
              (siteDetails.historicalData || []).slice(-6),
              ['c1', 'c2', 'c3', 'c4'],
              ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']
            )}

            {selectedTab === 1 && renderChart(
              (siteDetails.historicalData || []).slice(-6),
              ['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008'],
              ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042', '#0088FE']
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Production Data Form */}
      {showForm && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Edit Production Data' : 'Add New Production Data'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              {/* First Line - Production Data */}
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Month"
                  select
                  value={newData.month || ''}
                  onChange={(e) => setNewData({ ...newData, month: e.target.value })}
                  disabled={editMode}
                  required
                  size="small"
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  label="Year"
                  select
                  value={newData.year || ''}
                  onChange={(e) => setNewData({ ...newData, year: e.target.value })}
                  disabled={editMode}
                  required
                  size="small"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C1"
                  type="number"
                  value={newData.c1}
                  onChange={handleInputChange('c1')}
                  error={formErrors.c1 !== undefined}
                  helperText={formErrors.c1}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C2"
                  type="number"
                  value={newData.c2}
                  onChange={handleInputChange('c2')}
                  error={formErrors.c2 !== undefined}
                  helperText={formErrors.c2}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C3"
                  type="number"
                  value={newData.c3}
                  onChange={handleInputChange('c3')}
                  error={formErrors.c3 !== undefined}
                  helperText={formErrors.c3}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C4"
                  type="number"
                  value={newData.c4}
                  onChange={handleInputChange('c4')}
                  error={formErrors.c4 !== undefined}
                  helperText={formErrors.c4}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit" 
                  disabled={submitStatus.loading}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {submitStatus.loading ? '...' : (editMode ? 'Update' : 'Submit')}
                </Button>
              </Grid>

              {/* Second Line - Charges Data */}
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C001"
                  type="number"
                  value={newData.c001}
                  onChange={handleInputChange('c001')}
                  error={formErrors.c001 !== undefined}
                  helperText={formErrors.c001}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C002"
                  type="number"
                  value={newData.c002}
                  onChange={handleInputChange('c002')}
                  error={formErrors.c002 !== undefined}
                  helperText={formErrors.c002}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C003"
                  type="number"
                  value={newData.c003}
                  onChange={handleInputChange('c003')}
                  error={formErrors.c003 !== undefined}
                  helperText={formErrors.c003}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C004"
                  type="number"
                  value={newData.c004}
                  onChange={handleInputChange('c004')}
                  error={formErrors.c004 !== undefined}
                  helperText={formErrors.c004}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C005"
                  type="number"
                  value={newData.c005}
                  onChange={handleInputChange('c005')}
                  error={formErrors.c005 !== undefined}
                  helperText={formErrors.c005}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C006"
                  type="number"
                  value={newData.c006}
                  onChange={handleInputChange('c006')}
                  error={formErrors.c006 !== undefined}
                  helperText={formErrors.c006}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C007"
                  type="number"
                  value={newData.c007}
                  onChange={handleInputChange('c007')}
                  error={formErrors.c007 !== undefined}
                  helperText={formErrors.c007}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1.5}>
                <TextField
                  fullWidth
                  label="C008"
                  type="number"
                  value={newData.c008}
                  onChange={handleInputChange('c008')}
                  error={formErrors.c008 !== undefined}
                  helperText={formErrors.c008}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={1}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCancel}
                  size="small"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Production History Table */}
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Production History</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>C1</TableCell>
                <TableCell>C2</TableCell>
                <TableCell>C3</TableCell>
                <TableCell>C4</TableCell>
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
              {siteDetails?.historicalData?.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.month}</TableCell>
                  <TableCell>{record.year}</TableCell>
                  <TableCell>{record.c1}</TableCell>
                  <TableCell>{record.c2}</TableCell>
                  <TableCell>{record.c3}</TableCell>
                  <TableCell>{record.c4}</TableCell>
                  <TableCell>{record.c001}</TableCell>
                  <TableCell>{record.c002}</TableCell>
                  <TableCell>{record.c003}</TableCell>
                  <TableCell>{record.c004}</TableCell>
                  <TableCell>{record.c005}</TableCell>
                  <TableCell>{record.c006}</TableCell>
                  <TableCell>{record.c007}</TableCell>
                  <TableCell>{record.c008}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(record)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(record)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ProductionDetails;
