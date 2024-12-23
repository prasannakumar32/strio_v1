import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography, Grid, Paper } from '@mui/material';
import './SiteDetails.css';
import Layout from './Layout';
import { useSiteContext } from '../context/SiteContext';
import api from '../services/api';

const SiteDetails = () => {
  const { siteId } = useParams();
  const { consumptionSites } = useSiteContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        setLoading(true);
        // First try to find the site in the context
        const siteFromContext = consumptionSites.find(site => site.id === siteId);
        
        if (siteFromContext) {
          setSelectedSite(siteFromContext);
        } else {
          // If not in context, fetch from API
          const response = await api.getSiteById(siteId);
          if (response.success && response.data) {
            setSelectedSite(response.data);
          } else {
            setError('Failed to fetch site details');
          }
        }
      } catch (err) {
        console.error('Error fetching site details:', err);
        setError('Error loading site details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (siteId) {
      fetchSiteDetails();
    }
  }, [siteId, consumptionSites]);

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
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </Layout>
    );
  }

  if (!selectedSite) {
    return (
      <Layout>
        <Box m={2}>
          <Alert severity="info">
            No site data available
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Paper className="site-details" elevation={3} sx={{ p: 3, m: 2 }}>
        <Typography variant="h4" gutterBottom>
          {selectedSite.name}
        </Typography>
        
        <Grid container spacing={3} className="details-grid">
          <Grid item xs={12} sm={6}>
            <Box className="detail-item">
              <Typography variant="subtitle1" color="textSecondary">
                Location:
              </Typography>
              <Typography variant="body1">
                {selectedSite.location}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box className="detail-item">
              <Typography variant="subtitle1" color="textSecondary">
                Type:
              </Typography>
              <Typography variant="body1">
                {selectedSite.type}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box className="detail-item">
              <Typography variant="subtitle1" color="textSecondary">
                Status:
              </Typography>
              <Typography 
                variant="body1" 
                className={`status ${selectedSite.status.toLowerCase()}`}
              >
                {selectedSite.status}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box className="detail-item">
              <Typography variant="subtitle1" color="textSecondary">
                Site ID:
              </Typography>
              <Typography variant="body1">
                {siteId}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
};

export default SiteDetails;