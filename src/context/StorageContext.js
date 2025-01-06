import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getProductionSiteData,
  getConsumptionSiteData,
  updateSiteMonthlyData,
  getDefaultValues
} from '../utils/storageUtils';

const StorageContext = createContext();

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export const StorageProvider = ({ children }) => {
  const [productionSites, setProductionSites] = useState({});
  const [consumptionSites, setConsumptionSites] = useState({});
  const [defaultValues, setDefaultValues] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const prodData = getProductionSiteData();
      const consData = getConsumptionSiteData();
      
      if (prodData) {
        setProductionSites(prodData);
        // Load default values for production sites
        Object.keys(prodData).forEach(siteId => {
          const defaults = getDefaultValues(siteId);
          if (defaults) {
            setDefaultValues(prev => ({
              ...prev,
              [siteId]: defaults
            }));
          }
        });
      }
      
      if (consData) {
        setConsumptionSites(consData);
        // Load default values for consumption sites
        Object.keys(consData).forEach(siteId => {
          const defaults = getDefaultValues(siteId);
          if (defaults) {
            setDefaultValues(prev => ({
              ...prev,
              [siteId]: defaults
            }));
          }
        });
      }
    };

    loadData();
    // Add event listener for storage changes
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const updateMonthlyData = async (updateObj) => {
    const { siteId, month, year, type, values } = updateObj;
    
    try {
      // Update local state first
      if (type === 'PRODUCTION') {
        const newProductionSites = { ...productionSites };
        Object.keys(newProductionSites).forEach(site => {
          if (site === siteId) {
            newProductionSites[site] = {
              ...newProductionSites[site],
              unitValues: {
                ...newProductionSites[site].unitValues,
                fromPowerplant: values
              }
            };
          }
        });
        setProductionSites(newProductionSites);
      } else if (type === 'CONSUMPTION') {
        const newConsumptionSites = { ...consumptionSites };
        Object.keys(newConsumptionSites).forEach(site => {
          if (site === siteId) {
            newConsumptionSites[site] = {
              ...newConsumptionSites[site],
              unitValues: values
            };
          }
        });
        setConsumptionSites(newConsumptionSites);
      } else if (type === 'BANKING') {
        const newProductionSites = { ...productionSites };
        Object.keys(newProductionSites).forEach(site => {
          if (site === siteId) {
            newProductionSites[site] = {
              ...newProductionSites[site],
              unitValues: {
                ...newProductionSites[site].unitValues,
                fromBanking: values
              }
            };
          }
        });
        setProductionSites(newProductionSites);
      }

      // Here you would typically make an API call to persist the changes
      // await api.updateSiteData(updateObj);

      return true;
    } catch (error) {
      console.error('Error updating monthly data:', error);
      throw error;
    }
  };

  const value = {
    productionSites,
    consumptionSites,
    defaultValues,
    updateMonthlyData,
    getDefaultValues: (siteId) => defaultValues[siteId] || null
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};
