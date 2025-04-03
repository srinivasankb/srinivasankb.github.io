// Yahoo Finance API service
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Get company financial information from Yahoo Finance API
 * @param {string} symbol - Stock symbol to look up
 * @returns {Promise<Object>} - Financial data
 */
async function getFinancialData(symbol) {
  try {
    console.log(`Fetching financial data for symbol: ${symbol}`);
    
    // In a real implementation, this would use the datasource module
    // For now, we'll simulate the API response structure
    
    // Simulate API response
    const mockResponse = {
      quoteSummary: {
        result: [{
          summaryProfile: {
            address1: "1 Apple Park Way",
            city: "Cupertino",
            state: "CA",
            zip: "95014",
            country: "United States",
            phone: "408 996 1010",
            website: "https://www.apple.com",
            industry: "Consumer Electronics",
            sector: "Technology",
            longBusinessSummary: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
            fullTimeEmployees: 164000,
            companyOfficers: [
              { name: "Timothy D. Cook", title: "CEO & Director" },
              { name: "Luca Maestri", title: "CFO & Senior VP" }
            ]
          },
          price: {
            regularMarketPrice: { raw: 175.34 },
            marketCap: { raw: 2750000000000 }
          }
        }],
        error: null
      }
    };
    
    // Transform the API response to our standardized format
    return transformYahooFinanceResponse(mockResponse, symbol);
  } catch (error) {
    console.error('Error fetching financial data from Yahoo Finance:', error);
    throw new Error('Failed to fetch financial data');
  }
}

/**
 * Get company news from Yahoo Finance API
 * @param {string} symbol - Stock symbol to look up
 * @returns {Promise<Object>} - News data
 */
async function getCompanyNews(symbol) {
  try {
    console.log(`Fetching news for symbol: ${symbol}`);
    
    // In a real implementation, this would use the datasource module
    // For now, we'll simulate the API response structure
    
    // Simulate API response
    const mockResponse = {
      result: [{
        entityIdType: "symbol",
        hits: [
          {
            report_title: "Company Announces New Product Line",
            ticker: [symbol],
            provider: "Business Wire",
            author: "Financial Reporter",
            abstract: "The company has announced a new product line that is expected to boost revenue.",
            report_date: Date.now() - 86400000 // Yesterday
          },
          {
            report_title: "Quarterly Earnings Beat Expectations",
            ticker: [symbol],
            provider: "Reuters",
            author: "Financial Analyst",
            abstract: "The company reported quarterly earnings that exceeded analyst expectations.",
            report_date: Date.now() - 172800000 // 2 days ago
          }
        ]
      }]
    };
    
    // Transform the API response to our standardized format
    return transformYahooNewsResponse(mockResponse);
  } catch (error) {
    console.error('Error fetching news from Yahoo Finance:', error);
    throw new Error('Failed to fetch company news');
  }
}

/**
 * Transform Yahoo Finance profile response to our standardized format
 * @param {Object} apiResponse - Raw API response
 * @param {string} symbol - Stock symbol
 * @returns {Object} - Transformed financial data
 */
function transformYahooFinanceResponse(apiResponse, symbol) {
  const profile = apiResponse.quoteSummary.result[0].summaryProfile;
  const price = apiResponse.quoteSummary.result[0].price;
  
  return {
    financial_data: {
      is_public: true,
      stock_info: {
        ticker: symbol,
        exchange: "NASDAQ", // This would come from the actual API
        current_price: price?.regularMarketPrice?.raw || 0,
        market_cap: price?.marketCap?.raw || 0
      },
      financial_ratios: {
        pe_ratio: 25.4, // This would come from the actual API
        revenue_growth: 0.12 // This would come from the actual API
      }
    },
    leadership: {
      executives: profile.companyOfficers?.map(officer => ({
        name: officer.name,
        title: officer.title,
        bio: ""
      })) || []
    },
    basic_info: {
      description: profile.longBusinessSummary || "",
      industry: profile.industry || "",
      sector: profile.sector || ""
    },
    contact_info: {
      headquarters: {
        street: profile.address1 || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        postal_code: profile.zip || ""
      },
      phone_numbers: [profile.phone] || []
    },
    metrics: {
      employee_count: profile.fullTimeEmployees || 0
    }
  };
}

/**
 * Transform Yahoo Finance news response to our standardized format
 * @param {Object} apiResponse - Raw API response
 * @returns {Object} - Transformed news data
 */
function transformYahooNewsResponse(apiResponse) {
  const newsItems = apiResponse.result[0].hits.map(item => ({
    title: item.report_title,
    date: new Date(item.report_date).toISOString().split('T')[0],
    source: item.provider,
    url: "#", // This would come from the actual API
    summary: item.abstract
  }));
  
  return {
    news_and_updates: {
      recent_news: newsItems
    }
  };
}

module.exports = {
  getFinancialData,
  getCompanyNews
};
