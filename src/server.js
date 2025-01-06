const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./api/routes');

const app = express();
const port = process.env.PORT || 3002;

// Comprehensive CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from React development servers and local hosts
    const allowedOrigins = [
      'http://localhost:3000',  // React default port
      'http://localhost:3001',  // Additional React port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://localhost:3002',
      undefined  // for same-origin requests
    ];
    
    console.log('CORS Origin Check:', {
      requestOrigin: origin,
      allowedOrigins: allowedOrigins
    });

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
  // Dynamically set origin based on the request
  const origin = req.headers.origin || '*';
  
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 
    'Content-Type, Authorization, Content-Length, X-Requested-With, Access-Control-Allow-Origin');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Middleware for parsing JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Comprehensive logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    originalUrl: req.originalUrl
  };
  
  console.group('Incoming Request');
  console.log(JSON.stringify(logEntry, null, 2));
  console.groupEnd();

  next();
});

// Test route with detailed diagnostics
app.get('/test', (req, res) => {
  try {
    console.log('Test route accessed', {
      origin: req.headers.origin,
      referer: req.headers.referer,
      host: req.headers.host
    });

    res.status(200).json({ 
      message: 'Server is working!', 
      timestamp: new Date().toISOString(),
      serverInfo: {
        port,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid,
        requestDetails: {
          origin: req.headers.origin,
          referer: req.headers.referer,
          host: req.headers.host
        }
      }
    });
  } catch (error) {
    console.error('Error in test route:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message
    });
  }
});

// API Routes
const apiRoutes = require('./api/routes');
app.use('/api/v1', apiRoutes);

// Comprehensive error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    code: err.code
  });

  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server with additional diagnostics
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Server Diagnostics:');
  console.log('- Process ID:', process.pid);
  console.log('- Node Environment:', process.env.NODE_ENV || 'development');
  console.log('- Available routes:');
  console.log('  * GET /test');
  console.log('  * GET /api/v1/production-sites');
  console.log('  * GET /api/v1/production-sites/:siteId/history');
  console.log('  * POST /api/v1/production-sites/:siteId/history');
  console.log('  * DELETE /api/v1/production-sites/:siteId/history/:id');
});

// Add error handlers for server
server.on('error', (error) => {
  console.error('Server Error:', {
    name: error.name,
    message: error.message,
    code: error.code
  });
});
