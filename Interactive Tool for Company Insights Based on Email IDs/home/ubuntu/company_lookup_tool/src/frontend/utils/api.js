// API service for frontend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Extract domain from email address
 * @param {string} email - Email address to extract domain from
 * @returns {Promise<Object>} - Domain data
 */
export const extractDomain = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/extract-domain`, { email });
    return response.data;
  } catch (error) {
    console.error('Error extracting domain:', error);
    throw error;
  }
};

/**
 * Get company data by domain
 * @param {string} domain - Company domain to look up
 * @param {string} [symbol] - Optional stock symbol for public companies
 * @returns {Promise<Object>} - Company data
 */
export const getCompanyData = async (domain, symbol = null) => {
  try {
    const url = symbol 
      ? `${API_BASE_URL}/company/${domain}?symbol=${symbol}`
      : `${API_BASE_URL}/company/${domain}`;
      
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching company data:', error);
    throw error;
  }
};

/**
 * Refresh company data
 * @param {string} domain - Company domain to refresh
 * @param {string} [symbol] - Optional stock symbol for public companies
 * @returns {Promise<Object>} - Fresh company data
 */
export const refreshCompanyData = async (domain, symbol = null) => {
  try {
    const url = symbol 
      ? `${API_BASE_URL}/company/${domain}/refresh?symbol=${symbol}`
      : `${API_BASE_URL}/company/${domain}/refresh`;
      
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    console.error('Error refreshing company data:', error);
    throw error;
  }
};

export default {
  extractDomain,
  getCompanyData,
  refreshCompanyData
};
