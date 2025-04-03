// API service for AbstractAPI Company Enrichment
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// In production, this would be loaded from environment variables
const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY || 'your_api_key_here';
const ABSTRACT_API_URL = 'https://companyenrichment.abstractapi.com/v1/';

/**
 * Get company information from AbstractAPI
 * @param {string} domain - Company domain to look up
 * @returns {Promise<Object>} - Company data
 */
async function getCompanyData(domain) {
  try {
    // In a real implementation, this would make an actual API call
    // For now, we'll simulate the API response structure
    
    console.log(`Fetching company data for domain: ${domain}`);
    
    // This would be the actual API call in production
    // const response = await axios.get(ABSTRACT_API_URL, {
    //   params: {
    //     api_key: ABSTRACT_API_KEY,
    //     domain: domain
    //   }
    // });
    
    // Simulate API response
    const mockResponse = {
      name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
      domain: domain,
      year_founded: 2010,
      industry: "Technology",
      employee_count: 500,
      locality: "San Francisco",
      country: "United States",
      linkedin_url: `https://linkedin.com/company/${domain.split('.')[0]}`,
      facebook_url: `https://facebook.com/${domain.split('.')[0]}`,
      twitter_url: `https://twitter.com/${domain.split('.')[0]}`,
      logo: `https://logo.clearbit.com/${domain}`
    };
    
    // Transform the API response to our standardized format
    return transformAbstractApiResponse(mockResponse);
  } catch (error) {
    console.error('Error fetching company data from AbstractAPI:', error);
    throw new Error('Failed to fetch company data');
  }
}

/**
 * Transform AbstractAPI response to our standardized format
 * @param {Object} apiResponse - Raw API response
 * @returns {Object} - Transformed company data
 */
function transformAbstractApiResponse(apiResponse) {
  return {
    basic_info: {
      domain: apiResponse.domain,
      name: apiResponse.name,
      logo_url: apiResponse.logo,
      description: apiResponse.description || `A company in the ${apiResponse.industry} industry.`,
      founded_year: apiResponse.year_founded,
      company_type: apiResponse.type || "Private",
      industry: apiResponse.industry,
      sector: apiResponse.sector || apiResponse.industry,
      website_url: `https://www.${apiResponse.domain}`,
      last_updated: new Date().toISOString()
    },
    contact_info: {
      headquarters: {
        street: apiResponse.street_address || "",
        city: apiResponse.locality || "",
        state: apiResponse.state || "",
        country: apiResponse.country || "",
        postal_code: apiResponse.postal_code || ""
      },
      phone_numbers: apiResponse.phone_numbers || [],
      email_addresses: apiResponse.email_addresses || [],
      social_media: {
        linkedin: apiResponse.linkedin_url || "",
        twitter: apiResponse.twitter_url || "",
        facebook: apiResponse.facebook_url || "",
        instagram: apiResponse.instagram_url || ""
      }
    },
    metrics: {
      employee_count: apiResponse.employee_count || 0,
      employee_range: apiResponse.employee_range || "",
      annual_revenue: apiResponse.annual_revenue || 0,
      revenue_range: apiResponse.revenue_range || "",
      market_share: 0, // Not provided by AbstractAPI
      global_ranking: apiResponse.global_ranking || 0,
      valuation: "" // Not provided by AbstractAPI
    },
    geographic_presence: {
      headquarters_location: {
        latitude: apiResponse.latitude || 0,
        longitude: apiResponse.longitude || 0
      },
      regions: [], // Not provided by AbstractAPI
      countries: [] // Not provided by AbstractAPI
    },
    technology_stack: {
      marketing: [],
      development: [],
      analytics: [],
      other: []
    }
  };
}

module.exports = {
  getCompanyData
};
