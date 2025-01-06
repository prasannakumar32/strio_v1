const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

// Initialize production sites
const productionSites = [
  { id: 'pudukottai_site', name: 'Pudukottai Site', type: 'wind' },
  { id: 'tirunelveli_site', name: 'Tirunelveli Site', type: 'wind' }
];

// Initialize production history
let productionHistory = {
  pudukottai_site: [],
  tirunelveli_site: []
};

// Get all production sites
router.get('/production-sites', (req, res) => {
  console.log('Sending production sites:', productionSites);
  res.json(productionSites);
});

// Get history for specific site
router.get('/production-sites/:siteId/history', (req, res) => {
  const { siteId } = req.params;
  console.log(`Getting history for site: ${siteId}`);
  const siteHistory = productionHistory[siteId] || [];
  console.log('Site history:', siteHistory);
  res.json(siteHistory);
});

// Add production data for a site
router.post('/production-sites/:siteId/history', upload.none(), (req, res) => {
  try {
    const { siteId } = req.params;
    const newData = req.body;
    console.log(`Adding production data for site ${siteId}:`, newData);

    const site = productionSites.find(s => s.id === siteId);
    if (!site) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const formattedData = {
      id: Date.now().toString(),
      month: newData.month,
      siteId: siteId,
      siteName: site.name,
      type: site.type,
      c1: parseFloat(newData.c1) || 0,
      c2: parseFloat(newData.c2) || 0,
      c3: parseFloat(newData.c3) || 0,
      c4: parseFloat(newData.c4) || 0,
      c5: parseFloat(newData.c5) || 0,
      createdAt: new Date().toISOString()
    };

    if (!productionHistory[siteId]) {
      productionHistory[siteId] = [];
    }

    // Check for existing entry for the same month
    const existingIndex = productionHistory[siteId].findIndex(item => item.month === newData.month);
    
    if (existingIndex !== -1) {
      // Update existing entry
      productionHistory[siteId][existingIndex] = {
        ...productionHistory[siteId][existingIndex],
        ...formattedData,
        updatedAt: new Date().toISOString()
      };
      console.log('Updated existing entry:', productionHistory[siteId][existingIndex]);
    } else {
      // Add new entry
      productionHistory[siteId].push(formattedData);
      console.log('Added new entry:', formattedData);
    }

    res.status(201).json(formattedData);
  } catch (error) {
    console.error('Error adding production data:', error);
    res.status(500).json({ error: 'Failed to add production data', details: error.message });
  }
});

// Delete production data
router.delete('/production-sites/:siteId/history/:id', (req, res) => {
  try {
    const { siteId, id } = req.params;
    console.log(`Deleting production data for site ${siteId}, id: ${id}`);
    
    if (!productionHistory[siteId]) {
      console.error(`Site not found: ${siteId}`);
      return res.status(404).json({ error: 'Site not found' });
    }

    const index = productionHistory[siteId].findIndex(item => item.id === id);
    if (index === -1) {
      console.error(`Record not found: ${id}`);
      return res.status(404).json({ error: 'Record not found' });
    }

    productionHistory[siteId].splice(index, 1);
    console.log(`Deleted record ${id} from site ${siteId}`);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting production data:', error);
    res.status(500).json({ error: 'Failed to delete production data', details: error.message });
  }
});

module.exports = router;
