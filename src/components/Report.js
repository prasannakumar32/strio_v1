// This file is renamed from Report.js to Reports.js

import React, { useState, useContext, useMemo } from 'react';
import { Typography, Box, Container, Paper, Tab, Tabs } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDownload, faShareAlt, faChartBar, faTable } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
import { UserContext } from '../context/UserContext';
import { useSiteContext } from '../context/SiteContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useContext(UserContext);
  const { productionSites, consumptionSites } = useSiteContext();

  // Filter sites based on logged-in user
  const userSites = useMemo(() => {
    return productionSites?.filter(site => site.userId === user?.username) || [];
  }, [productionSites, user?.username]);

  // Calculate totals for user's sites
  const totals = useMemo(() => {
    return userSites.reduce((acc, site) => {
      acc.production += site.capacity || 0;
      // Assuming consumption is 80% of capacity for demonstration
      acc.consumption += (site.capacity || 0) * 0.8;
      // Banking is only for sites with banking enabled
      acc.banking += site.hasBanking ? (site.bankingCapacity || 0) : 0;
      return acc;
    }, { production: 0, consumption: 0, banking: 0 });
  }, [userSites]);

  // Prepare chart data from user's sites
  const chartData = {
    labels: userSites.map(site => site.name),
    datasets: [
      {
        label: 'Production (units)',
        data: userSites.map(site => site.capacity),
        backgroundColor: '#1976d2',
      },
      {
        label: 'Consumption (units)',
        data: userSites.map(site => site.capacity * 0.8),
        backgroundColor: '#64b5f6',
      },
      {
        label: 'Banking (units)',
        data: userSites.map(site => site.hasBanking ? (site.bankingCapacity || 0) : 0),
        backgroundColor: '#4f83cc',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Energy Production, Consumption & Banking',
        color: '#1976d2',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Power (units)',
          color: '#1976d2',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Sites',
          color: '#1976d2',
        },
      },
    },
  };

  const columns = [
    { field: 'site', headerName: 'Site', width: 150 },
    { field: 'production', headerName: 'Production (units)', width: 150, type: 'number' },
    { field: 'consumption', headerName: 'Consumption (units)', width: 150, type: 'number' },
    { field: 'lapse', headerName: 'Lapse (units)', width: 150, type: 'number' },
    { field: 'allocation', headerName: 'Allocation (units)', width: 150, type: 'number' },
    { field: 'banking', headerName: 'Banking (units)', width: 150, type: 'number' },
  ];

  const rows = userSites.map((site, index) => {
    const production = site.capacity;
    const consumption = site.capacity * 0.8;
    const lapse = production - consumption;
    const banking = site.hasBanking ? (site.bankingCapacity || 0) : 0;
    const allocation = banking;

    return {
      id: site.id,
      site: site.name,
      production: Math.round(production),
      consumption: Math.round(consumption),
      lapse: Math.round(lapse),
      allocation: Math.round(banking),
      banking: Math.round(banking),
    };
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      pt: 4, 
      pb: 4 
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Energy Allocation Reports for {user?.username}
        </Typography>

        <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab 
              icon={<FontAwesomeIcon icon={faChartBar} />} 
              label="Charts" 
              sx={{ 
                color: activeTab === 0 ? '#1976d2' : 'inherit',
                '&.Mui-selected': { color: '#1976d2' }
              }}
            />
            <Tab 
              icon={<FontAwesomeIcon icon={faTable} />} 
              label="Table" 
              sx={{ 
                color: activeTab === 1 ? '#1976d2' : 'inherit',
                '&.Mui-selected': { color: '#1976d2' }
              }}
            />
          </Tabs>

          {activeTab === 0 ? (
            <Box sx={{ height: '400px', mb: 3 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          ) : (
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    color: '#1976d2',
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-cell': {
                    color: '#333',
                  },
                }}
              />
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <FontAwesomeIcon 
              icon={faDownload} 
              style={{ cursor: 'pointer', color: '#1976d2', marginRight: '1rem' }} 
              size="lg"
            />
            <FontAwesomeIcon 
              icon={faShareAlt} 
              style={{ cursor: 'pointer', color: '#1976d2' }} 
              size="lg"
            />
          </Box>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {/* Summary Cards */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FontAwesomeIcon icon={faFileAlt} size="2x" style={{ color: '#1976d2' }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FontAwesomeIcon icon={faDownload} style={{ cursor: 'pointer', color: '#1976d2' }} />
                <FontAwesomeIcon icon={faShareAlt} style={{ cursor: 'pointer', color: '#1976d2' }} />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>Total Production</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
              Total Production: {Math.round(totals.production)} units
              <br />
              Total Consumption: {Math.round(totals.consumption)} units
              <br />
              Total Banking: {Math.round(totals.banking)} units
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Reports;
