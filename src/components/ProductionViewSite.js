import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { fetchConsumptionSiteDetails, fetchConsumptionSiteHistoricalData } from '../services/productionApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ConsumptionSiteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('consumption');
  const [chartType, setChartType] = useState('line');
  const [formData, setFormData] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch consumption site details
        const siteResponse = await fetchConsumptionSiteDetails(id);
        setSite(siteResponse.data);

        // Fetch historical consumption data
        const historicalData = await fetchConsumptionSiteHistoricalData(id);
        setHistoricalData(historicalData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      month: '',
      c1: '',
      c2: '',
      c3: '',
      c4: ''
    });
  };

  const handleSubmit = () => {
    const newEntry = {
      ...formData,
      total: Number(formData.c1) + Number(formData.c2) + Number(formData.c3) + Number(formData.c4)
    };
    setHistoricalData([...historicalData, newEntry]);
    handleCloseDialog();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const chartData = {
    labels: historicalData.map(item => item.month),
    datasets: [
      {
        label: 'C1',
        data: historicalData.map(item => item.c1),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'C2',
        data: historicalData.map(item => item.c2),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'C3',
        data: historicalData.map(item => item.c3),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'C4',
        data: historicalData.map(item => item.c4),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">{site?.name || 'Site Details'}</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            + ENTER NEW DATA
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography><strong>Location:</strong> {site?.location}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography><strong>Type:</strong> {site?.type}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography><strong>Capacity:</strong> {site?.capacity}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography><strong>Status:</strong> {site?.status}</Typography>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="CONSUMPTION METRICS" value="consumption" />
            <Tab label="CHARGES METRICS" value="charges" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Button
            variant={chartType === 'line' ? 'contained' : 'outlined'}
            onClick={() => handleChartTypeChange('line')}
            sx={{ mr: 1 }}
          >
            LINE CHART
          </Button>
          <Button
            variant={chartType === 'bar' ? 'contained' : 'outlined'}
            onClick={() => handleChartTypeChange('bar')}
          >
            BAR CHART
          </Button>
        </Box>

        <Box sx={{ height: 400, mb: 4 }}>
          {chartType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>Consumption History</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>C1</TableCell>
                <TableCell>C2</TableCell>
                <TableCell>C3</TableCell>
                <TableCell>C4</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicalData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.c1}</TableCell>
                  <TableCell>{row.c2}</TableCell>
                  <TableCell>{row.c3}</TableCell>
                  <TableCell>{row.c4}</TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Enter New Consumption Data</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="C1"
                type="number"
                value={formData.c1}
                onChange={(e) => setFormData({ ...formData, c1: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="C2"
                type="number"
                value={formData.c2}
                onChange={(e) => setFormData({ ...formData, c2: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="C3"
                type="number"
                value={formData.c3}
                onChange={(e) => setFormData({ ...formData, c3: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="C4"
                type="number"
                value={formData.c4}
                onChange={(e) => setFormData({ ...formData, c4: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsumptionSiteView;
