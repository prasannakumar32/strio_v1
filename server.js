const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const sitesRouter = require('./src/api/routes/sites');
const productionRouter = require('./src/api/routes/production');

const app = express();
const PORT = 3002;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount routes
app.use('/api/v1/production-sites', sitesRouter);
app.use('/api/v1/production', productionRouter);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET  /api/v1/production-sites');
  console.log('- GET  /api/v1/production-sites/:siteId/history');
  console.log('- POST /api/v1/production-sites/:siteId/history');
});
