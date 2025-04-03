// Clearbit API service
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// In production, this would be loaded from environment variables
const CLEARBIT_API_KEY = process.env.CLEARBIT_API_KEY || 'your_api_key_here';
const CLEARBIT_NAME_TO_DOMAIN_URL = 'https://company.clearbit.com/v1/domains/find';

/**
 * Get domain from company name using Clearbit
 * @param {string} companyName - Company name to look up
 * @returns {Promise<Object>} - Domain data
 */
async function getDomainFromName(companyName) {
  try {
    console.log(`Looking up domain for company name: ${companyName}`);
    
    // In a real implementation, this would make an actual API call
    // For now, we'll simulate the API response structure
    
    // This would be the actual API call in production
    // const response = await axios.get(CLEARBIT_NAME_TO_DOMAIN_URL, {
    //   params: { name: companyName },
    //   auth: { username: CLEARBIT_API_KEY }
    // });
    
    // Simulate API response
    const mockResponse = {
      name: companyName,
      domain: `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      logo: `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`
    };
    
    return mockResponse;
  } catch (error) {
    console.error('Error fetching domain from Clearbit:', error);
    throw new Error('Failed to fetch domain information');
  }
}

/**
 * Get logo URL for a domain
 * @param {string} domain - Domain to get logo for
 * @returns {string} - Logo URL
 */
function getLogoUrl(domain) {
  return `https://logo.clearbit.com/${domain}`;
}

module.exports = {
  getDomainFromName,
  getLogoUrl
};
