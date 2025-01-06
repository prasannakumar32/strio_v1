import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Speed as ConsumptionIcon,
  PowerOutlined as PowerIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { CONSUMPTION_SITES } from '../data/sites';

function Consumption() {
  const navigate = useNavigate();

  const handleSiteClick = (siteId) => {
    navigate(`/consumption/view/${siteId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, color: '#1a237e', fontWeight: 500 }}>
        Consumption Sites
      </Typography>

      <Grid container spacing={3}>
        {CONSUMPTION_SITES.map((site) => (
          <Grid item xs={12} sm={6} md={4} key={site.id}>
            <Paper 
              sx={{ 
                p: 3, 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => handleSiteClick(site.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 500 }}>
                  {site.name}
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: '#1a237e' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSiteClick(site.id);
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {site.location}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BusinessIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {site.type}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ConsumptionIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {site.capacity}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PowerIcon sx={{ mr: 1, color: '#666' }} />
                    <Typography variant="body2" color="text.secondary">
                      {site.serviceNumber}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Consumption;
