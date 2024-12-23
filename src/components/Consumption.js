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
  Alert,
  IconButton
} from '@mui/material';
import { useSiteContext } from '../context/SiteContext';
import api from '../services/api';
import Layout from './Layout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Consumption = () => {
  const navigate = useNavigate();
  const { consumptionSites } = useSiteContext();
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

    const fetchConsumptionSites = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get sites from API or localStorage
        const storedSites = JSON.parse(localStorage.getItem('consumptionSites') || '[]');
        
        // Add unique IDs if they don't exist
        const sitesWithIds = storedSites.map(site => ({
          ...site,
          id: site.id || `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }));

        setSites(sitesWithIds);
        localStorage.setItem('consumptionSites', JSON.stringify(sitesWithIds));

      } catch (err) {
        console.error('Error loading consumption sites:', err);
        setError('Error loading consumption sites. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsumptionSites();
  }, [navigate]);

  const handleSiteClick = (siteId) => {
    if (!siteId) {
      console.error('Invalid site ID');
      return;
    }
    navigate(`/consumption/view/${siteId}`);
  };

  const handleDelete = (siteId) => {
    if (!siteId) {
      console.error('Invalid site ID');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        console.error('No user found');
        return;
      }

      const updatedSites = sites.filter(site => site.id !== siteId);
      setSites(updatedSites);
      localStorage.setItem('consumptionSites', JSON.stringify(updatedSites));

    } catch (error) {
      console.error('Error deleting site:', error);
      setError('Failed to delete site. Please try again.');
    }
  };

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

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Consumption Sites
            </Typography>
          </Grid>

          {sites.map((site) => (
            <Grid item xs={12} sm={6} md={4} key={site.id || `temp_${Date.now()}`}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip
                      label={site.status === 'active' ? 'Active' : 'Inactive'}
                      color={site.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSiteClick(site.id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this site?')) {
                            handleDelete(site.id);
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Consumption;
