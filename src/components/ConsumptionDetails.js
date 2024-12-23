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
import { MOCK_CONSUMPTION_SITES } from '../services/productionApi';

const ConsumptionDetails = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState(MOCK_CONSUMPTION_SITES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box m={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Layout>
    );
  }

  const handleSiteClick = (siteId) => {
    navigate(`/consumption/view/${siteId}`);
  };

  console.log('Sites:', sites);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Consumption Sites
        </Typography>

        <Grid container spacing={3}>
          {sites && sites.map((site) => (
            <Grid item xs={12} sm={6} key={site.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
                onClick={() => handleSiteClick(site.id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {site.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Location: {site.location}, Tamil Nadu
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Capacity: {site.capacity} units
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={site.type}
                      color="primary"
                      size="small"
                      sx={{ 
                        mr: 1,
                        backgroundColor: '#1976d2'
                      }}
                    />
                    <Chip
                      label={site.status}
                      color="success"
                      size="small"
                      sx={{
                        backgroundColor: '#4caf50'
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default ConsumptionDetails;
