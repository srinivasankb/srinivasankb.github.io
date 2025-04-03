// Update data integration service to use cache
const abstractApiService = require('./abstractApiService');
const yahooFinanceService = require('./yahooFinanceService');
const clearbitService = require('./clearbitService');
const geminiAiService = require('./geminiAiService');
const cacheService = require('./cacheService');

/**
 * Get comprehensive company data from multiple sources
 * @param {string} domain - Company domain to look up
 * @param {string} [stockSymbol] - Optional stock symbol for public companies
 * @returns {Promise<Object>} - Comprehensive company data
 */
async function getComprehensiveCompanyData(domain, stockSymbol = null) {
  try {
    console.log(`Fetching comprehensive data for domain: ${domain}`);
    
    // Check cache first
    const cacheKey = `company_data_${domain}`;
    const cachedData = cacheService.get(cacheKey);
    
    if (cachedData) {
      console.log(`Returning cached data for domain: ${domain}`);
      return cachedData;
    }
    
    // Step 1: Get basic company data from AbstractAPI
    const abstractData = await abstractApiService.getCompanyData(domain);
    
    // Step 2: If stock symbol is provided, get financial data from Yahoo Finance
    let financialData = {};
    let newsData = {};
    
    if (stockSymbol) {
      try {
        financialData = await yahooFinanceService.getFinancialData(stockSymbol);
        newsData = await yahooFinanceService.getCompanyNews(stockSymbol);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        // Continue with other data sources even if financial data fails
      }
    }
    
    // Step 3: Get logo URL from Clearbit
    const logoUrl = clearbitService.getLogoUrl(domain);
    
    // Step 4: Merge data from all sources
    let mergedData = {
      ...abstractData,
      ...financialData,
      ...newsData,
      basic_info: {
        ...abstractData.basic_info,
        logo_url: logoUrl,
        ...(financialData.basic_info || {})
      }
    };
    
    // Step 5: Enhance data with Gemini AI
    const enhancedData = await geminiAiService.enhanceCompanyData(mergedData);
    
    // Step 6: Generate conversation starters
    const conversationStarters = await geminiAiService.generateConversationStarters(enhancedData);
    
    // Final comprehensive data
    const comprehensiveData = {
      ...enhancedData,
      conversation_starters: conversationStarters
    };
    
    // Cache the result
    cacheService.set(cacheKey, comprehensiveData);
    
    return comprehensiveData;
  } catch (error) {
    console.error('Error in data integration service:', error);
    throw new Error('Failed to integrate company data');
  }
}

/**
 * Extract stock symbol from company data if available
 * @param {Object} companyData - Basic company data
 * @returns {string|null} - Stock symbol or null
 */
function extractStockSymbol(companyData) {
  // This is a simplified implementation
  // In a real application, this would use more sophisticated logic
  if (companyData.basic_info.company_type === 'Public' && 
      companyData.financial_data && 
      companyData.financial_data.stock_info && 
      companyData.financial_data.stock_info.ticker) {
    return companyData.financial_data.stock_info.ticker;
  }
  
  return null;
}

/**
 * Clear cache for a specific domain
 * @param {string} domain - Company domain
 */
function clearCacheForDomain(domain) {
  const cacheKey = `company_data_${domain}`;
  cacheService.delete(cacheKey);
}

module.exports = {
  getComprehensiveCompanyData,
  extractStockSymbol,
  clearCacheForDomain
};
