import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  ViewModule as ViewModuleIcon,
  CompareArrows as CompareArrowsIcon,
  BarChart as BarChartIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { StorageProvider } from '../context/StorageContext';
import logo from '../assets/logo.jpg';

const navItems = [
  { icon: <HomeIcon />, path: '/dashboard', label: 'Home' },
  { icon: <ViewModuleIcon />, path: '/production', label: 'Production' },
  { icon: <AssessmentIcon />, path: '/consumption', label: 'Consumption' },
  { icon: <CompareArrowsIcon />, path: '/allocation', label: 'Allocation' },
  { icon: <BarChartIcon />, path: '/reports', label: 'Reports' }
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <StorageProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            backgroundColor: '#1a237e',
            boxShadow: 'none',
            zIndex: (theme) => theme.zIndex.drawer + 1 
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo and Company Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="STRIO ENERGY"
                sx={{
                  height: 40,
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            {/* Navigation Icons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => (
                <IconButton
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname.startsWith(item.path) 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>

            {/* User Profile */}
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8, // Add margin top to account for fixed AppBar
            backgroundColor: '#f5f5f5'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </StorageProvider>
  );
}

export default Layout;
