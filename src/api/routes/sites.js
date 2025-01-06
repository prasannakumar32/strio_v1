const express = require('express');
const router = express.Router();

// Initialize production sites
const productionSites = [
  { id: 'pudukottai_site', name: 'Pudukottai Site', type: 'wind' },
  { id: 'tirunelveli_site', name: 'Tirunelveli Site', type: 'wind' }
];

// Get all production sites
router.get('/', (req, res) => {
  console.log('Sending production sites:', productionSites);
  res.json(productionSites);
});

module.exports = router;
