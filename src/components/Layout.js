import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import FactoryIcon from '@mui/icons-material/Factory';
import BusinessIcon from '@mui/icons-material/Business';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.jpg';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername] = React.useState('');

  const navigationIcons = [
    { icon: HomeIcon, path: '/dashboard', tooltip: 'Dashboard' },
    { icon: FactoryIcon, path: '/production', tooltip: 'Production' },
    { icon: BusinessIcon, path: '/consumption', tooltip: 'Consumption' },
    { icon: SwapHorizIcon, path: '/allocation', tooltip: 'Allocation' },
    { icon: AssessmentIcon, path: '/reports', tooltip: 'Reports' }
  ];

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) {
      setUsername(user.username);
    }
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <img src={Logo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" component="div">
              STRIO ENERGY
            </Typography>
          </Box>

          {/* Navigation Icons */}
          <Box sx={{ 
            display: 'flex', 
            flexGrow: 1, 
            justifyContent: 'center',
            gap: 2 
          }}>
            {navigationIcons.map(({ icon: Icon, path, tooltip }) => (
              <Tooltip title={tooltip} key={path}>
                <IconButton
                  size="large"
                  color={location.pathname === path ? "secondary" : "inherit"}
                  onClick={() => navigate(path)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    ...(location.pathname === path && {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    })
                  }}
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            ))}
          </Box>

          {/* User Account Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              {username}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
