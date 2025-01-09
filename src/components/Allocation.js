import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Link,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Autorenew as AutorenewIcon,
  Download as DownloadIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { useStorage } from '../context/StorageContext';
import AllocationEditForm from './AllocationEditForm';
import { PRODUCTION_SITES, CONSUMPTION_SITES } from '../data/sites';
import { getConsumptionSites } from '../utils/consumptionStorage';

const Allocation = () => {
  const navigate = useNavigate();
  const { updateMonthlyData } = useStorage();
  const [consumptionSites, setConsumptionSites] = useState([]);
  const [productionSites, setProductionSites] = useState(PRODUCTION_SITES);
  const [allocationDetails, setAllocationDetails] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [updateType, setUpdateType] = useState(null); // 'edit' or 'update'
  const [refreshKey, setRefreshKey] = useState(0);
  const [allocationSummary, setAllocationSummary] = useState({
    totalProduction: 0,
    totalAllocated: 0,
    totalBanking: 0,
    lapse: 0
  });

  useEffect(() => {
    const loadSites = async () => {
      const sites = await getConsumptionSites();
      const sitesWithLatestValues = sites.map(site => {
        const latestData = site.historicalData[0];
        const total = Object.keys(latestData)
          .filter(key => key.startsWith('c'))
          .reduce((sum, key) => sum + (latestData[key] || 0), 0);

        return {
          id: site.id,
          name: site.name,
          location: site.location,
          c1: latestData.c1 || 0,
          c2: latestData.c2 || 0,
          c3: latestData.c3 || 0,
          c4: latestData.c4 || 0,
          c5: latestData.c5 || 0,
          total: total
        };
      });
      setConsumptionSites(sitesWithLatestValues);
    };
    loadSites();
  }, []);

  const handleViewDetails = (siteId, type) => {
    try {
      if (type === 'PRODUCTION') {
        // Map the site IDs to their correct view IDs
        const siteIdMapping = {
          'TIRUNELVELI': 'PW1',
          'PUDUKOTTAI': 'PS1'
        };
        
        const siteId = siteIdMapping[siteId];
        if (siteId) {
          if (siteId === 'PS1' || siteId === 'PW1') {
            navigate(`/production/${siteId}`);
          } else {
            navigate(`/production/view/${siteId}`);
          }
        } else {
          console.error('Unknown production site:', siteId);
        }
      } else if (type === 'CONSUMPTION') {
        // Use the site ID directly from the consumption site
        navigate(`/consumption/${siteId}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleEditSite = (site, type) => {
    setSelectedSite(site);
    setSelectedType(type);
    setUpdateType('edit');
    setEditDialogOpen(true);
  };

  const handleUpdateSite = (site, type) => {
    setSelectedSite(site);
    setSelectedType(type);
    setUpdateType('update');
    setEditDialogOpen(true);
  };

  const handleCloseDialog = async (updatedData) => {
    if (updatedData) {
      try {
        const formattedData = {
          C1: updatedData.C1 || "0",
          C2: updatedData.C2 || "0",
          C3: updatedData.C3 || "0",
          C4: updatedData.C4 || "0",
          C5: updatedData.C5 || "0"
        };

        const updateObj = {
          siteId: selectedSite.id,
          month: 'Dec',
          year: '2025',
          type: selectedType,
          values: formattedData,
          updateType: updateType
        };

        await updateMonthlyData(updateObj);

        // Update local state based on the type and update type
        if (selectedType === 'PRODUCTION') {
          const updatedSites = productionSites.map(site => 
            site.id === selectedSite.id 
              ? {
                  ...site,
                  unitValues: {
                    ...site.unitValues,
                    [updateType === 'update' ? 'fromBanking' : 'fromPowerplant']: formattedData
                  }
                }
              : site
          );
          setProductionSites(updatedSites);
        } else if (selectedType === 'CONSUMPTION') {
          const updatedSites = consumptionSites.map(site => 
            site.id === selectedSite.id 
              ? {
                  ...site,
                  unitValues: formattedData
                }
              : site
          );
          setConsumptionSites(updatedSites);
        }

        // Recalculate allocation summary
        const summary = calculateAllocationSummary();
        setAllocationSummary(summary);
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error updating site data:', error);
      }
    }
    setEditDialogOpen(false);
    setUpdateType(null);
  };

  const calculateAllocationSummary = () => {
    let totalProduction = 0;
    let totalAllocated = 0;
    let totalBanking = 0;

    productionSites.forEach(site => {
      const powerplant = site.unitValues?.fromPowerplant || {};
      const banking = site.unitValues?.fromBanking || {};

      const production = Object.entries(powerplant)
        .filter(([key]) => key.startsWith('C'))
        .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

      const bankingTotal = Object.entries(banking)
        .filter(([key]) => key.startsWith('C'))
        .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

      totalProduction += production;
      totalBanking += bankingTotal;
    });

    consumptionSites.forEach(site => {
      const values = site.unitValues || {};
      const allocated = Object.entries(values)
        .filter(([key]) => key.startsWith('C'))
        .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

      totalAllocated += allocated;
    });

    return {
      totalProduction,
      totalAllocated,
      totalBanking,
      lapse: Math.max(0, totalProduction - totalAllocated - totalBanking)
    };
  };

  const handleAutoAllocate = async () => {
    try {
      // Step 1: Separate sites by type
      const solarSites = productionSites.filter(site => site.name.toLowerCase().includes('solar'));
      const windSites = productionSites.filter(site => site.name.toLowerCase().includes('wind'));
      
      // Deep clone the sites to work with
      const updatedProductionSites = [...productionSites];
      
      // Initialize banking units for wind sites
      windSites.forEach(windSite => {
        const siteIndex = updatedProductionSites.findIndex(s => s.id === windSite.id);
        if (siteIndex !== -1) {
          updatedProductionSites[siteIndex] = {
            ...windSite,
            unitValues: {
              ...windSite.unitValues,
              fromBanking: { C1: "0", C2: "0", C3: "0", C4: "0", C5: "0" }
            }
          };
        }
      });

      // Step 2: Calculate total consumption per slot
      const totalConsumption = {
        C1: 0, C2: 0, C3: 0, C4: 0, C5: 0
      };

      consumptionSites.forEach(site => {
        const values = site.unitValues || {};
        Object.entries(values)
          .filter(([key]) => key.startsWith('C'))
          .forEach(([key, value]) => {
            totalConsumption[key] += Number(value) || 0;
          });
      });

      // Step 3: Allocate current production (non-banking)
      let remainingConsumption = { ...totalConsumption };
      
      // First allocate from solar sites (no banking)
      solarSites.forEach(site => {
        const powerplant = site.unitValues?.fromPowerplant || {};
        Object.keys(remainingConsumption).forEach(slot => {
          const production = Number(powerplant[slot]) || 0;
          remainingConsumption[slot] = Math.max(0, remainingConsumption[slot] - production);
        });
      });

      // Then allocate from wind sites current production
      windSites.forEach(site => {
        const powerplant = site.unitValues?.fromPowerplant || {};
        Object.keys(remainingConsumption).forEach(slot => {
          const production = Number(powerplant[slot]) || 0;
          remainingConsumption[slot] = Math.max(0, remainingConsumption[slot] - production);
        });
      });

      // Step 4: Handle over/under consumption
      windSites.forEach(windSite => {
        const siteIndex = updatedProductionSites.findIndex(s => s.id === windSite.id);
        if (siteIndex !== -1) {
          const powerplant = windSite.unitValues?.fromPowerplant || {};
          const currentBanking = updatedProductionSites[siteIndex].unitValues?.fromBanking || {};
          
          Object.keys(remainingConsumption).forEach(slot => {
            const production = Number(powerplant[slot]) || 0;
            const consumption = totalConsumption[slot];
            const remaining = remainingConsumption[slot];

            if (remaining > 0) {
              // Over-consumption: Use banking if available
              const bankingUsed = Math.min(remaining, Number(currentBanking[slot]) || 0);
              currentBanking[slot] = String(bankingUsed);
              remainingConsumption[slot] -= bankingUsed;
            } else {
              // Under-consumption: Add to banking
              const excess = production - consumption;
              if (excess > 0) {
                currentBanking[slot] = String(excess);
              }
            }
          });

          // Update the site with new banking values
          updatedProductionSites[siteIndex] = {
            ...updatedProductionSites[siteIndex],
            unitValues: {
              ...updatedProductionSites[siteIndex].unitValues,
              fromBanking: currentBanking
            }
          };
        }
      });

      // Step 5: Calculate lapse (only if there's still remaining consumption)
      const lapse = Object.values(remainingConsumption).reduce((sum, val) => sum + val, 0);

      // Update production sites with new banking values
      setProductionSites(updatedProductionSites);
      
      // Recalculate allocation summary
      const summary = calculateAllocationSummary();
      setAllocationSummary(summary);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error in auto allocation:', error);
    }
  };

  useEffect(() => {
    const summary = calculateAllocationSummary();
    setAllocationSummary(summary);
  }, [refreshKey, productionSites, consumptionSites]);

  const renderProductionTable = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Production Sites</Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a237e' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Site Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C1 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C2 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C3 (Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C4 (Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C5 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productionSites.map((site) => {
              const powerplant = site.unitValues?.fromPowerplant || {};
              const banking = site.unitValues?.fromBanking || {};
              
              const powerplantTotal = Object.entries(powerplant)
                .filter(([key]) => key.startsWith('C'))
                .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);
              
              const bankingTotal = Object.entries(banking)
                .filter(([key]) => key.startsWith('C'))
                .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

              return (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell align="right">{powerplant.C1 || 0}</TableCell>
                  <TableCell align="right">{powerplant.C2 || 0}</TableCell>
                  <TableCell align="right">{powerplant.C3 || 0}</TableCell>
                  <TableCell align="right">{powerplant.C4 || 0}</TableCell>
                  <TableCell align="right">{powerplant.C5 || 0}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    {powerplantTotal}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Edit Production">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditSite(site, 'PRODUCTION')}
                          sx={{ color: '#1a237e' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {site.name.toLowerCase().includes('wind') && (
                        <Tooltip title="Update Banking">
                          <IconButton 
                            size="small"
                            onClick={() => handleUpdateSite(site, 'PRODUCTION')}
                            sx={{ color: '#2e7d32' }}
                          >
                            <UpdateIcon fontSize="small" />
                          </IconButton>
                      </Tooltip>
                      )}
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewDetails(site.id, 'PRODUCTION')}
                          sx={{ color: '#2e7d32' }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderConsumptionTable = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>Consumption Sites</Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1a237e' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Site Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C1 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C2 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C3 (Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C4 (Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C5 (Non-Peak)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Total</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumptionSites.map((site) => {
              const values = site.unitValues || {};
              const total = Object.entries(values)
                .filter(([key]) => key.startsWith('C'))
                .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

              return (
                <TableRow key={site.id}>
                  <TableCell>{site.name}</TableCell>
                  <TableCell>{site.location}</TableCell>
                  <TableCell align="right">{values.C1 || 0}</TableCell>
                  <TableCell align="right">{values.C2 || 0}</TableCell>
                  <TableCell align="right">{values.C3 || 0}</TableCell>
                  <TableCell align="right">{values.C4 || 0}</TableCell>
                  <TableCell align="right">{values.C5 || 0}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1a237e' }}>{total}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Edit Consumption">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditSite(site, 'CONSUMPTION')}
                          sx={{ color: '#1a237e' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleViewDetails(site.id, 'CONSUMPTION')}
                          sx={{ color: '#2e7d32' }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderAllocationDetailsTable = () => {
    const getAllocations = () => {
      const allocations = [];

      productionSites.forEach(prodSite => {
        consumptionSites.forEach(consSite => {
          const consValues = consSite.unitValues || {};
          const total = Object.entries(consValues)
            .filter(([key]) => key.startsWith('C'))
            .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

          if (total > 0) {
            allocations.push({
              month: 'Dec',
              fromSite: prodSite,
              toSite: consSite,
              values: {
                C1: consValues.C1 || 0,
                C2: consValues.C2 || 0,
                C3: consValues.C3 || 0,
                C4: consValues.C4 || 0,
                C5: consValues.C5 || 0
              },
              total,
              type: 'Allocation'
            });
          }
        });

        const banking = prodSite.unitValues?.fromBanking || {};
        const bankingTotal = Object.entries(banking)
          .filter(([key]) => key.startsWith('C'))
          .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

        if (bankingTotal > 0) {
          allocations.push({
            month: 'Dec',
            fromSite: prodSite,
            toSite: { name: 'Banking', type: 'BANKING' },
            values: {
              C1: banking.C1 || 0,
              C2: banking.C2 || 0,
              C3: banking.C3 || 0,
              C4: banking.C4 || 0,
              C5: banking.C5 || 0
            },
            total: bankingTotal,
            type: 'Banking'
          });
        }

        const powerplant = prodSite.unitValues?.fromPowerplant || {};
        const production = Object.entries(powerplant)
          .filter(([key]) => key.startsWith('C'))
          .reduce((sum, [_, val]) => sum + (Number(val) || 0), 0);

        const allocated = allocations
          .filter(a => a.fromSite.id === prodSite.id)
          .reduce((sum, a) => sum + a.total, 0);

        const lapse = Math.max(0, production - allocated);
        if (lapse > 0) {
          allocations.push({
            month: 'Dec',
            fromSite: prodSite,
            toSite: { name: 'Lapse', type: 'LAPSE' },
            values: {
              C1: Math.round(lapse * 0.2),
              C2: Math.round(lapse * 0.2),
              C3: Math.round(lapse * 0.2),
              C4: Math.round(lapse * 0.2),
              C5: Math.round(lapse * 0.2)
            },
            total: lapse,
            type: 'Lapse'
          });
        }
      });

      return allocations;
    };

    const allocations = getAllocations();

    return (
      <Box sx={{ mb: 4 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#1a237e' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Month</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>From Site</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>To Site</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C1 (Non-Peak)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C2 (Non-Peak)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C3 (Peak)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C4 (Peak)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">C5 (Non-Peak)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.map((allocation, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    bgcolor: allocation.type === 'Banking' 
                      ? '#fff3e0' 
                      : allocation.type === 'Lapse'
                        ? '#ffebee'
                        : 'inherit',
                    '&:hover': {
                      bgcolor: allocation.type === 'Banking' 
                        ? '#ffe0b2' 
                        : allocation.type === 'Lapse'
                          ? '#ffcdd2'
                          : '#f5f5f5'
                    }
                  }}
                >
                  <TableCell>{allocation.month}</TableCell>
                  <TableCell>{allocation.fromSite.name}</TableCell>
                  <TableCell>{allocation.toSite.name}</TableCell>
                  <TableCell align="right">{allocation.values.C1}</TableCell>
                  <TableCell align="right">{allocation.values.C2}</TableCell>
                  <TableCell align="right">{allocation.values.C3}</TableCell>
                  <TableCell align="right">{allocation.values.C4}</TableCell>
                  <TableCell align="right">{allocation.values.C5}</TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 'bold',
                      color: allocation.type === 'Banking' 
                        ? '#ed6c02' 
                        : allocation.type === 'Lapse'
                          ? '#d32f2f'
                          : '#2e7d32'
                    }}
                  >
                    {allocation.total}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: allocation.type === 'Banking' 
                        ? '#ed6c02' 
                        : allocation.type === 'Lapse'
                          ? '#d32f2f'
                          : '#2e7d32',
                      fontWeight: 'bold'
                    }}
                  >
                    {allocation.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ bgcolor: '#f5f5ff', p: 2, mb: 4, borderRadius: 1 }}>
        <Typography variant="h4" align="center" sx={{ color: '#1a237e' }}>
          Allocation Management
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
        Production Sites
      </Typography>
      {renderProductionTable()}

      <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#1a237e' }}>
        Consumption Sites
      </Typography>
      {renderConsumptionTable()}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AutorenewIcon />}
          onClick={handleAutoAllocate}
          sx={{ 
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#0d47a1'
            },
            px: 4,
            py: 1
          }}
        >
          Auto Allocate
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>Allocation Results</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#1a237e', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle1">Total Production</Typography>
              <Typography variant="h4">{allocationSummary.totalProduction || 0}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>Units</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#2e7d32', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle1">Total Allocated</Typography>
              <Typography variant="h4">{allocationSummary.totalAllocated || 0}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>Units</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ed6c02', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle1">Total Banking</Typography>
              <Typography variant="h4">{allocationSummary.totalBanking || 0}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>Units</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#d32f2f', color: 'white' }}>
            <CardContent>
              <Typography variant="subtitle1">Lapse</Typography>
              <Typography variant="h4">{allocationSummary.lapse || 0}</Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>Units</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 3, color: '#1a237e' }}>Site Allocation Details</Typography>
      {renderAllocationDetailsTable()}

      <AllocationEditForm
        open={editDialogOpen}
        onClose={handleCloseDialog}
        site={selectedSite}
        type={selectedType}
        updateType={updateType}
      />
    </Container>
  );
};

export default Allocation;