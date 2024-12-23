import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress
} from '@mui/material';
import {
  Factory as FactoryIcon,
  Business as BusinessIcon,
  SwapHoriz as SwapHorizIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import Layout from './Layout';
import { useSiteContext } from '../context/SiteContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { productionSites, consumptionSites } = useSiteContext();
  const [dashboardData, setDashboardData] = useState({
    production: {
      count: 0,
      totalCapacity: 0,
      activeCount: 0
    },
    consumption: {
      count: 0,
      totalConsumption: 0,
      activeCount: 0
    },
    allocation: {
      totalAllocated: 0,
      pendingCount: 0
    },
    reports: {
      totalReports: 0,
      lastUpdated: null
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateDashboardData = () => {
      try {
        // Calculate Production Stats
        const productionStats = {
          count: productionSites?.length || 0,
          totalCapacity: productionSites?.reduce((sum, site) => sum + Number(site.capacity || 0), 0) || 0,
          activeCount: productionSites?.filter(site => site.status === 'active').length || 0
        };

        // Calculate Consumption Stats
        const consumptionStats = {
          count: consumptionSites?.length || 0,
          totalConsumption: consumptionSites?.reduce((sum, site) => sum + Number(site.consumption || 0), 0) || 0,
          activeCount: consumptionSites?.filter(site => site.status === 'active').length || 0
        };

        // Get allocation data from localStorage or calculate
        const allocationData = JSON.parse(localStorage.getItem('allocationData')) || {
          totalAllocated: productionStats.totalCapacity * 0.8, // Example calculation
          pendingCount: Math.floor(Math.random() * 5) // Example random pending count
        };

        // Get reports data from localStorage or set default
        const reportsData = JSON.parse(localStorage.getItem('reportsData')) || {
          totalReports: productionStats.count + consumptionStats.count,
          lastUpdated: new Date().toISOString()
        };

        setDashboardData({
          production: productionStats,
          consumption: consumptionStats,
          allocation: allocationData,
          reports: reportsData
        });

        setLoading(false);
      } catch (error) {
        console.error('Error calculating dashboard data:', error);
        setLoading(false);
      }
    };

    calculateDashboardData();
  }, [productionSites, consumptionSites]);

  const cards = [
    {
      title: 'Production',
      icon: <FactoryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      stats: [
        { label: 'Total Sites', value: dashboardData.production.count },
        { label: 'Total Capacity', value: `${dashboardData.production.totalCapacity} MW` },
        { label: 'Active Sites', value: dashboardData.production.activeCount }
      ],
      path: '/production'
    },
    {
      title: 'Consumption',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      stats: [
        { label: 'Total Sites', value: dashboardData.consumption.count },
        { label: 'Total Consumption', value: `${dashboardData.consumption.totalConsumption} units` },
        { label: 'Active Sites', value: dashboardData.consumption.activeCount }
      ],
      path: '/consumption'
    },
    {
      title: 'Allocation',
      icon: <SwapHorizIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      stats: [
        { label: 'Total Allocated', value: `${dashboardData.allocation.totalAllocated} MW` },
        { label: 'Pending Allocations', value: dashboardData.allocation.pendingCount }
      ],
      path: '/allocation'
    },
    {
      title: 'Reports',
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      stats: [
        { label: 'Total Reports', value: dashboardData.reports.totalReports },
        { label: 'Last Updated', value: new Date(dashboardData.reports.lastUpdated).toLocaleDateString() }
      ],
      path: '/reports'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(card.path)} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {card.icon}
                      <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                        {card.title}
                      </Typography>
                    </Box>
                    {card.stats.map((stat, idx) => (
                      <Box key={idx} mb={1}>
                        <Typography color="textSecondary" variant="body2">
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" component="div">
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
