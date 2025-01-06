import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Factory as FactoryIcon,
  Business as BusinessIcon,
  SwapHoriz as SwapHorizIcon,
  Assessment as AssessmentIcon,
  Power as PowerIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  WindPower as WindPowerIcon,
  WbSunny as WbSunnyIcon,
  Storage as StorageIcon,
  Pending as PendingIcon,
  Update as UpdateIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';

function Dashboard() {
  const navigate = useNavigate();

  const stats = {
    production: {
      totalSites: { value: 2, icon: <FactoryIcon /> },
      totalCapacity: { value: '150 units', icon: <PowerIcon /> },
      activeSites: { value: 2, icon: <CheckCircleIcon /> },
      windSites: { value: 0, icon: <WindPowerIcon /> },
      solarSites: { value: 0, icon: <WbSunnyIcon /> },
    },
    consumption: {
      totalSites: { value: 0, icon: <BusinessIcon /> },
      totalConsumption: { value: '0 units', icon: <SpeedIcon /> },
      activeSites: { value: 0, icon: <CheckCircleIcon /> },
    },
    allocation: {
      totalAllocated: { value: '120 units', icon: <StorageIcon /> },
      pendingAllocations: { value: 1, icon: <PendingIcon /> },
      recentAllocations: { value: 2, icon: <UpdateIcon /> },
      availableForAllocation: { value: '30 units', icon: <SwapHorizIcon /> },
    },
    reports: {
      totalReports: { value: 2, icon: <AssignmentIcon /> },
      lastUpdated: { value: '17/12/2024', icon: <CalendarMonthIcon /> },
    },
  };

  const cardColors = {
    production: {
      main: '#00bcd4',
      light: '#e0f7fa'
    },
    consumption: {
      main: '#e91e63',
      light: '#fce4ec'
    },
    allocation: {
      main: '#757575',
      light: '#f5f5f5'
    },
    reports: {
      main: '#ffc107',
      light: '#fff8e1'
    }
  };

  const StatBox = ({ title, items, color }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          bgcolor: color.light,
        },
      }}
      onClick={() => navigate(`/${title.toLowerCase()}`)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {title === 'Production' && <FactoryIcon sx={{ color: color.main, mr: 1, fontSize: 28 }} />}
        {title === 'Consumption' && <BusinessIcon sx={{ color: color.main, mr: 1, fontSize: 28 }} />}
        {title === 'Allocation' && <SwapHorizIcon sx={{ color: color.main, mr: 1, fontSize: 28 }} />}
        {title === 'Reports' && <AssessmentIcon sx={{ color: color.main, mr: 1, fontSize: 28 }} />}
        <Typography variant="h6" sx={{ color: color.main }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.entries(items).map(([key, data]) => (
          <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                mr: 2, 
                color: color.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: color.light,
              }}
            >
              {React.cloneElement(data.icon, { sx: { fontSize: 20 } })}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {data.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatBox
            title="Production"
            items={stats.production}
            color={cardColors.production}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatBox
            title="Consumption"
            items={stats.consumption}
            color={cardColors.consumption}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatBox
            title="Allocation"
            items={stats.allocation}
            color={cardColors.allocation}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatBox
            title="Reports"
            items={stats.reports}
            color={cardColors.reports}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
