import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useSiteContext } from '../context/SiteContext';
import api from '../services/api';
import Layout from './Layout';

const Production = () => {
  const navigate = useNavigate();
  const { productionSites } = useSiteContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProductionSites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getSites('PRODUCTION');

        if (response.success && response.data) {
          const sortedSites = response.data.sort((a, b) => {
            if (a.type === 'WIND' && b.type === 'SOLAR') return -1;
            if (a.type === 'SOLAR' && b.type === 'WIND') return 1;
            return 0;
          });

          setSites(sortedSites);
          localStorage.setItem('productionSites', JSON.stringify(sortedSites));
        } else {
          const storedSites = JSON.parse(localStorage.getItem('productionSites') || '[]');
          if (storedSites.length > 0) {
            setSites(storedSites);
          } else {
            setError(response.error || 'Failed to fetch production sites');
          }
        }
      } catch (err) {
        console.error('Error loading production sites:', err);
        const storedSites = JSON.parse(localStorage.getItem('productionSites') || '[]');
        if (storedSites.length > 0) {
          setSites(storedSites);
        } else {
          setError('Error loading production sites. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductionSites();
  }, []);

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

  const displaySites = sites.length > 0 ? sites : [];

  const handleSiteClick = (siteId) => {
    navigate(`/production/view/${siteId}`);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Production Sites
            </Typography>
          </Grid>

          {displaySites.map((site) => (
            <Grid item xs={12} sm={6} md={4} key={site.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleSiteClick(site.id)}
              >
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {site.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Location: {site.location}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Type: {site.type}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Capacity: {site.capacity?.toLocaleString()} MW
                  </Typography>
                  <Chip
                    label={site.status === 'active' ? 'Active' : 'Inactive'}
                    color={site.status === 'active' ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Production;
