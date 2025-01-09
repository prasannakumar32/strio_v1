import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  PowerSettingsNew as StatusIcon,
  GridOn as GridIcon,
  Speed as CapacityIcon,
  Numbers as ServiceNumberIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { getProductionSites } from '../utils/productionStorage';

function ProductionSiteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [selectedTab, setSelectedTab] = useState('unit');
  const [chartType, setChartType] = useState('line');
  const [openDialog, setOpenDialog] = useState(false);
  const [newData, setNewData] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: '',
    c001: '',
    c002: '',
    c003: '',
    c004: '',
    c005: '',
    c006: '',
    c007: '',
    c008: ''
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const sites = await getProductionSites();
        const foundSite = sites.find(s => s.id === id);
        if (foundSite) {
          setSite({
            ...foundSite,
            unitMatrixData: [
              {
                month: 'July',
                c1: 789,
                c2: 67,
                c3: 88,
                c4: 67,
                c5: 89
              },
              {
                month: 'February',
                c1: 786,
                c2: 67,
                c3: 88,
                c4: 67,
                c5: 89
              },
              {
                month: 'May',
                c1: 456,
                c2: 45,
                c3: 78,
                c4: 90,
                c5: 34
              }
            ],
            chargesMatrixData: [
              {
                month: 'July',
                c001: 234,
                c002: 567,
                c003: 890,
                c004: 123,
                c005: 456,
                c006: 789,
                c007: 234,
                c008: 567
              },
              {
                month: 'February',
                c001: 345,
                c002: 678,
                c003: 901,
                c004: 234,
                c005: 567,
                c006: 890,
                c007: 123,
                c008: 456
              },
              {
                month: 'May',
                c001: 456,
                c002: 789,
                c003: 123,
                c004: 456,
                c005: 789,
                c006: 234,
                c007: 567,
                c008: 890
              }
            ],
            cData: [
              {
                id: 1,
                month: 'July',
                c1: 789,
                c2: 67,
                c3: 88,
                c4: 67,
                c5: 89
              },
              {
                id: 2,
                month: 'February',
                c1: 786,
                c2: 67,
                c3: 88,
                c4: 67,
                c5: 89
              },
              {
                id: 3,
                month: 'May',
                c1: 456,
                c2: 45,
                c3: 78,
                c4: 90,
                c5: 34
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error loading site data:', error);
      }
    };
    loadSiteData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getDataKeys = () => {
    if (selectedTab === 'unit') {
      return ['c1', 'c2', 'c3', 'c4', 'c5'];
    }
    return ['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008'];
  };

  const getData = () => {
    if (!site) return [];
    return selectedTab === 'unit' ? site?.unitMatrixData : site?.chargesMatrixData;
  };

  const getRandomColor = (index) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#0088FE', '#00C49F', '#FFBB28'];
    return colors[index];
  };

  const handleOpenDialog = () => {
    setNewData({
      month: '',
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      c001: '',
      c002: '',
      c003: '',
      c004: '',
      c005: '',
      c006: '',
      c007: '',
      c008: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (field) => (event) => {
    setNewData({
      ...newData,
      [field]: event.target.value
    });
  };

  const handleSubmit = () => {
    const newEntry = {
      month: newData.month,
      ...(selectedTab === 'unit' 
        ? {
            c1: Number(newData.c1) || 0,
            c2: Number(newData.c2) || 0,
            c3: Number(newData.c3) || 0,
            c4: Number(newData.c4) || 0,
            c5: Number(newData.c5) || 0
          }
        : {
            c001: Number(newData.c001) || 0,
            c002: Number(newData.c002) || 0,
            c003: Number(newData.c003) || 0,
            c004: Number(newData.c004) || 0,
            c005: Number(newData.c005) || 0,
            c006: Number(newData.c006) || 0,
            c007: Number(newData.c007) || 0,
            c008: Number(newData.c008) || 0
          }
      )
    };

    if (selectedTab === 'unit') {
      setSite({
        ...site,
        unitMatrixData: [...site.unitMatrixData, newEntry]
      });
    } else {
      setSite({
        ...site,
        chargesMatrixData: [...site.chargesMatrixData, newEntry]
      });
    }

    handleCloseDialog();
  };

  const handleEditClick = (data) => {
    setSelectedData(data);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setSelectedData(null);
    setEditDialogOpen(false);
  };

  const handleEditSave = async (editedData) => {
    try {
      const updatedCData = site.cData.map(row => 
        row.id === selectedData.id ? {
          ...row,
          ...editedData,
          c1: parseInt(editedData.c1) || 0,
          c2: parseInt(editedData.c2) || 0,
          c3: parseInt(editedData.c3) || 0,
          c4: parseInt(editedData.c4) || 0,
          c5: parseInt(editedData.c5) || 0
        } : row
      );
      
      setSite({
        ...site,
        cData: updatedCData
      });
      
      handleEditClose();
    } catch (error) {
      console.error('Error updating C values:', error);
    }
  };

  const handleDeleteClick = (data) => {
    setSelectedData(data);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteClose = () => {
    setSelectedData(null);
    setDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const updatedCData = site.cData.filter(row => row.id !== selectedData.id);
      setSite({
        ...site,
        cData: updatedCData
      });
      
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting C values:', error);
    }
  };

  if (!site) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/production')}
          sx={{ mb: 2 }}
        >
          Back to Production Sites
        </Button>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {'Pudukottai Solar Park'}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {site.id === 'ps1' ? 'Pudukottai, Tamil Nadu' : site.id === 'tw1' ? 'Tirunelveli, Tamil Nadu' : site.location}
        </Typography>
      </Grid>

      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Site Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Name"
                  secondary={site.id === 'ps1' ? 'Pudukottai Solar Park' : site.id === 'tw1' ? 'Tirunelveli Wind Farm' : site.name}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <LocationIcon sx={{ color: '#2e7d32' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Location"
                  secondary={site.id === 'ps1' ? 'Pudukottai, Tamil Nadu' : site.id === 'tw1' ? 'Tirunelveli, Tamil Nadu' : site.location}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <BusinessIcon sx={{ color: '#ed6c02' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Type"
                  secondary={site.id === 'ps1' ? 'SOLAR' : site.id === 'tw1' ? 'WIND' : site.type}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <GridIcon sx={{ color: '#d32f2f' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Grid"
                  secondary="TANGEDCO"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <StatusIcon sx={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Status"
                  secondary="Active"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CapacityIcon sx={{ color: '#0288d1' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Capacity"
                  secondary={site.id === 'ps1' ? '600 MW' : site.id === 'tw1' ? '1000 MW' : site.capacity}
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <ServiceNumberIcon sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Service Number"
                  secondary={site.id === 'ps1' ? 'TNL-001' : site.id === 'tw1' ? '069534460069' : site.serviceNumber}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Historical Production Graph</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{ marginRight: 0 }}
              >
                Enter New Data
              </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={selectedTab} 
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab value="unit" label="UNIT MATRIX" />
                <Tab value="charges" label="CHARGES MATRIX" />
              </Tabs>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={(e, value) => value && setChartType(value)}
                size="small"
              >
                <ToggleButton value="line">LINE</ToggleButton>
                <ToggleButton value="bar">BAR</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer>
                {chartType === 'line' ? (
                  <LineChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {getDataKeys().map((key, index) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        name={key.toUpperCase()}
                        stroke={getRandomColor(index)}
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {getDataKeys().map((key, index) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        name={key.toUpperCase()}
                        fill={getRandomColor(index)}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={12}>
          <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Historical Production Data</Typography>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>C1</TableCell>
                    <TableCell>C2</TableCell>
                    <TableCell>C3</TableCell>
                    <TableCell>C4</TableCell>
                    <TableCell>C5</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {site.cData.map((data) => {
                    const totalC = data.c1 + data.c2 + data.c3 + data.c4 + data.c5;
                    return (
                      <TableRow key={data.id}>
                        <TableCell>{data.month}</TableCell>
                        <TableCell>{data.c1}</TableCell>
                        <TableCell>{data.c2}</TableCell>
                        <TableCell>{data.c3}</TableCell>
                        <TableCell>{data.c4}</TableCell>
                        <TableCell>{data.c5}</TableCell>
                        <TableCell>{totalC}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEditClick(data)}>
                            <EditIcon sx={{ color: 'primary.main' }} />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(data)}>
                            <DeleteIcon sx={{ color: 'error.main' }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
              <DialogTitle>Edit C Values</DialogTitle>
              <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
                  <TextField
                    label="Month"
                    fullWidth
                    value={selectedData?.month || ''}
                    margin="normal"
                    name="month"
                    onChange={(e) => {
                      setSelectedData({
                        ...selectedData,
                        month: e.target.value
                      });
                    }}
                  />
                  {['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
                    <TextField
                      key={field}
                      label={field.toUpperCase()}
                      fullWidth
                      type="number"
                      value={selectedData?.[field] || ''}
                      margin="normal"
                      name={field}
                      onChange={(e) => {
                        setSelectedData({
                          ...selectedData,
                          [field]: e.target.value
                        });
                      }}
                    />
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditClose}>Cancel</Button>
                <Button 
                  onClick={() => handleEditSave(selectedData)} 
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 3 }}>
            <Dialog open={deleteConfirmOpen} onClose={handleDeleteClose}>
              <DialogTitle>Confirm Delete C Values Entry</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete the C values entry for {selectedData?.month}? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteClose}>Cancel</Button>
                <Button 
                  onClick={handleDeleteConfirm} 
                  color="error" 
                  variant="contained"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Enter New {selectedTab === 'unit' ? 'Unit Matrix' : 'Charges Matrix'} Data
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 2 }}>
            <TextField
              select
              label="Month"
              value={newData.month}
              onChange={handleInputChange('month')}
              fullWidth
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: 2 
            }}>
              {selectedTab === 'unit' ? (
                // Unit Matrix Fields (C1-C5)
                ['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
                  <TextField
                    key={field}
                    label={field.toUpperCase()}
                    type="number"
                    value={newData[field]}
                    onChange={handleInputChange(field)}
                    fullWidth
                  />
                ))
              ) : (
                // Charges Matrix Fields (C001-C008)
                ['c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008'].map((field) => (
                  <TextField
                    key={field}
                    label={field.toUpperCase()}
                    type="number"
                    value={newData[field]}
                    onChange={handleInputChange(field)}
                    fullWidth
                  />
                ))
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!newData.month}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ProductionSiteDetails;
