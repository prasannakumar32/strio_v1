import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { UserProvider, useUser } from './context/UserContext';
import { SiteProvider } from './context/SiteContext';
import theme from './theme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Production from './components/Production';
import ProductionDetails from './pages/ProductionDetails';
import Consumption from './components/Consumption';
import ConsumptionDetails from './components/ConsumptionDetails';
import ConsumptionSiteDetails from './components/ConsumptionSiteDetails';
import Allocation from './components/Allocation';
import Reports from './components/Reports';
import ProductionSiteView from './components/ProductionSiteView';
import SiteDetails from './components/SiteDetails';
import ProductionSiteDetails from './components/ProductionSiteDetails';
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SiteProvider>
        <UserProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/production" 
              element={
                <ProtectedRoute>
                  <Production />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/production-details" 
              element={
                <ProtectedRoute>
                  <ProductionDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consumption" 
              element={
                <ProtectedRoute>
                  <Consumption />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consumption-details" 
              element={
                <ProtectedRoute>
                  <ConsumptionDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consumption-site-details" 
              element={
                <ProtectedRoute>
                  <ConsumptionSiteDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/allocation" 
              element={
                <ProtectedRoute>
                  <Allocation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/production-site-view" 
              element={
                <ProtectedRoute>
                  <ProductionSiteView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/site-details" 
              element={
                <ProtectedRoute>
                  <SiteDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/production-site-details" 
              element={
                <ProtectedRoute>
                  <ProductionSiteDetails />
                </ProtectedRoute>
              } 
            />

            {/* Default and Catch-all Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </UserProvider>
      </SiteProvider>
    </ThemeProvider>
  );
}

export default App;