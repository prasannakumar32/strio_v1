import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Speed as EfficiencyIcon,
  PowerOutlined as PowerIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Production() {
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState({});

  const PRODUCTION_SITES = [
    {
      id: 'PS1',
      name: 'Pudukottai Solar Farm',
      location: 'Pudukottai',
      capacity: '50 MW',
      type: 'SOLAR',
      status: 'Active',
      coordinates: '8.7139, 77.7567',
      historicalData: {
        '2025-01': { total: 163000 },
        '2024-12': { total: 160000 },
        '2024-11': { total: 156000 }
      }
    },
    {
      id: 'PW1',
      name: 'Tirunelveli Wind Park',
      location: 'Tirunelveli',
      capacity: '50 MW',
      type: 'WIND',
      status: 'Active',
      coordinates: '8.7139, 77.7567',
      historicalData: {
        '2025-01': { total: 96000 },
        '2024-12': { total: 93000 },
        '2024-11': { total: 92500 }
      }
    }
  ];

  const getHistoricalChartData = (site) => {
    if (!site.historicalData) return [];
    
    return Object.entries(site.historicalData)
      .map(([month, data]) => ({
        month: formatMonthDisplay(month),
        total: data.total
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const formatMonthDisplay = (monthStr) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleSiteClick = (siteId) => {
    if (siteId === 'PS1' || siteId === 'PW1') {
      navigate(`/production/${siteId}`);
    } else {
      navigate(`/production/view/${siteId}`);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PowerIcon sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h5" component="h1">
          Production Sites
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {PRODUCTION_SITES.map((site) => (
          <Grid item xs={12} md={6} key={site.id}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  {site.name}
                </Typography>
                <IconButton 
                  color="primary"
                  onClick={() => handleSiteClick(site.id)}
                  sx={{ mt: -1 }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {site.location}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Type: {site.type}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <EfficiencyIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Capacity: {site.capacity}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Latest Production (January 2025)
                </Typography>
                <Typography variant="h4" color="primary">
                  {site.historicalData['2025-01'].total.toLocaleString()} KWh
                </Typography>
              </Box>

              <Box sx={{ height: 200, mt: 3, mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Historical Production (3 Months)
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getHistoricalChartData(site)}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#8884d8" 
                      name="Total Production (KWh)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              <Chip
                label={site.status}
                color={site.status === 'Active' ? 'success' : 'error'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Production;
