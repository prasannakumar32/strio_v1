import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import {
  Factory as FactoryIcon,
  Numbers as ServiceNumberIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import { getProductionSites } from '../utils/productionStorage';

function Production() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const sitesData = await getProductionSites();
        setSites(sitesData);
      } catch (error) {
        console.error('Error loading production sites:', error);
      }
    };
    loadSites();
  }, []);

  const handleSiteClick = (siteId) => {
    navigate(`/production/${siteId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          sx={{ 
            mr: 2, 
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
        >
          <FactoryIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Production Sites
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {sites.map((site) => (
          <Grid item xs={12} sm={6} key={site.id}>
            <Paper
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleSiteClick(site.id)}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {site.id === 'PS1' ? 'Pudukottai Solar Park' : 'Tirunelveli Wind Farm'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {site.id === 'PS1' ? 'Vadakadu, Keelathur, Pudukottai' : 'Radhapuram, Tirunelveli'}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ServiceNumberIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    Service Number: {site.serviceNumber}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BankIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {site.id === 'PS1' ? 'Solar' : 'Wind'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={site.id === 'PS1' ? 'SOLAR' : 'WIND'}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label="Active"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Production;
