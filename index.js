// index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const promoCodeController = require('./controllers/promoCodeController');
const awardItemController = require('./controllers/awardItemController');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Allowed origins
const whiteListedOrigins = [
    'https://vuelanding.com'
];

//IP security
const allowedIPs = [
    '86.195.103.7', // My IP
    '109.27.168.126'
];

// Configure CORS to allow specific origins
const corsOptions = {
    origin: function (origin, callback) {
  
      // Allow all localhost origins dynamically
      if (!origin || whiteListedOrigins.includes(origin) || /^http:\/\/localhost(:[0-9]+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    preflightContinue: true,
    credentials: true // Allows cookies to be sent
};

// Middleware to check for allowed IP addresses
const ipWhitelist = (req, res, next) => {
    const origin = req.headers.origin;
    
    // If origin is in whitelisted origin don't check IP (for frontends access) skip IP check
    if (whiteListedOrigins.includes(origin) || req.path.startsWith('/api/licencing')) {
      return next();
    }
  
    // Get client IP address
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    // Remove any port information from the IP address
    const cleanIP = clientIP.split(':')[0];
  
    if (allowedIPs.includes(cleanIP)) {
      next();
    } else {
      res.status(403).send('Access forbidden');
    }
  };

// Apply CORS and IP whitelist middleware globally, but override for specific routes
// app.use((req, res, next) => {
//   // Apply CORS and IP whitelist middleware to all other routes
//   cors(corsOptions)(req, res, () => ipWhitelist(req, res, next));
// });
app.use(cors())
  

// Routes
app.use('/api', promoCodeController);
app.use('/api', awardItemController);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
