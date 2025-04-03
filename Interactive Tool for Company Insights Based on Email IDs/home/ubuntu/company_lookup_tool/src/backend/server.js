// Add a refresh endpoint to the server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dataIntegrationService = require('./services/dataIntegrationService');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('SurveySparrow Company Lookup Tool API is running');
});

// Email domain extraction endpoint
app.post('/api/extract-domain', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    // Simple regex to extract domain from email
    const domainRegex = /@([^@]+)$/;
    const match = email.match(domainRegex);
    
    if (!match || !match[1]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
    }
    
    const domain = match[1];
    
    return res.status(200).json({
      success: true,
      data: {
        email,
        domain
      }
    });
  } catch (error) {
    console.error('Error extracting domain:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while extracting domain'
    });
  }
});

// Company lookup endpoint using integrated data services
app.get('/api/company/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const { symbol } = req.query; // Optional stock symbol
    
    if (!domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Domain is required' 
      });
    }
    
    // Get comprehensive company data from all sources
    const companyData = await dataIntegrationService.getComprehensiveCompanyData(domain, symbol);
    
    return res.status(200).json({
      success: true,
      data: companyData
    });
  } catch (error) {
    console.error('Error looking up company:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while looking up company'
    });
  }
});

// Refresh company data endpoint
app.post('/api/company/:domain/refresh', async (req, res) => {
  try {
    const { domain } = req.params;
    const { symbol } = req.query; // Optional stock symbol
    
    if (!domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Domain is required' 
      });
    }
    
    // Clear cache for this domain
    dataIntegrationService.clearCacheForDomain(domain);
    
    // Get fresh company data
    const companyData = await dataIntegrationService.getComprehensiveCompanyData(domain, symbol);
    
    return res.status(200).json({
      success: true,
      data: companyData
    });
  } catch (error) {
    console.error('Error refreshing company data:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while refreshing company data'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
