// Utility functions for managing storage data

export const getProductionSiteData = () => {
  try {
    const data = localStorage.getItem('productionSiteData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting production site data:', error);
    return null;
  }
};

export const getConsumptionSiteData = () => {
  try {
    const data = localStorage.getItem('consumptionSiteData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting consumption site data:', error);
    return null;
  }
};

export const getSiteMonthlyData = (siteId, month = '2025-01') => {
  try {
    // Try production sites first
    const productionData = getProductionSiteData();
    if (productionData?.[siteId]?.monthlyData?.[month]) {
      return productionData[siteId].monthlyData[month];
    }

    // If not found, try consumption sites
    const consumptionData = getConsumptionSiteData();
    if (consumptionData?.[siteId]?.monthlyData?.[month]) {
      return consumptionData[siteId].monthlyData[month];
    }

    return null;
  } catch (error) {
    console.error('Error getting site monthly data:', error);
    return null;
  }
};

export const getDefaultValues = (siteId) => {
  try {
    // Try production sites first
    const productionData = getProductionSiteData();
    if (productionData?.[siteId]?.defaultValues) {
      return productionData[siteId].defaultValues;
    }

    // If not found, try consumption sites
    const consumptionData = getConsumptionSiteData();
    if (consumptionData?.[siteId]?.defaultValues) {
      return consumptionData[siteId].defaultValues;
    }

    return null;
  } catch (error) {
    console.error('Error getting default values:', error);
    return null;
  }
};

export const updateSiteMonthlyData = (siteId, month, newData) => {
  try {
    // Try production sites first
    const productionData = getProductionSiteData();
    if (productionData?.[siteId]) {
      productionData[siteId].monthlyData[month] = {
        ...productionData[siteId].monthlyData[month],
        ...newData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('productionSiteData', JSON.stringify(productionData));
      return true;
    }

    // If not found, try consumption sites
    const consumptionData = getConsumptionSiteData();
    if (consumptionData?.[siteId]) {
      consumptionData[siteId].monthlyData[month] = {
        ...consumptionData[siteId].monthlyData[month],
        ...newData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('consumptionSiteData', JSON.stringify(consumptionData));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating site monthly data:', error);
    return false;
  }
};
