import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSiteContext } from '../context/SiteContext';
import Layout from './Layout';
import { MOCK_CONSUMPTION_DATA } from '../services/productionApi';

const ConsumptionDetails = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState(MOCK_CONSUMPTION_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedSite } = useSiteContext();

  useEffect(() => {
    if (!selectedSite) {
      navigate('/consumption');
    }
  }, [selectedSite, navigate]);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  if (!selectedSite) {
    return null;
  }

  const site = sites.find(s => s.id === selectedSite.id) || selectedSite;

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {site.name} - Consumption Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Site Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Location:</strong> {site.location}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Capacity:</strong> {site.capacity} MW
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong>{' '}
                    <Chip
                      label={site.status}
                      color={site.status === 'Active' ? 'success' : 'error'}
                      size="small"
                    />
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Consumption Statistics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Total Consumption:</strong> {site.totalConsumption} MWh
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Peak Demand:</strong> {site.peakDemand} MW
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Average Daily Usage:</strong> {site.avgDailyUsage} MWh
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ConsumptionDetails;
