// Gemini AI service for enhancing company data
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// In production, this would be loaded from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your_api_key_here';

/**
 * Enhance company data using Gemini 2.0 Flash Lite AI
 * @param {Object} companyData - Basic company data to enhance
 * @returns {Promise<Object>} - Enhanced company data
 */
async function enhanceCompanyData(companyData) {
  try {
    console.log(`Enhancing data for company: ${companyData.basic_info.name}`);
    
    // In a real implementation, this would make an actual API call to Gemini
    // For now, we'll simulate the AI enhancement
    
    // Simulate enhanced data
    const enhancedData = {
      ...companyData,
      basic_info: {
        ...companyData.basic_info,
        description: companyData.basic_info.description || 
          `${companyData.basic_info.name} is a leading company in the ${companyData.basic_info.industry} industry, known for innovative solutions and customer-focused approach.`
      },
      leadership: {
        ceo: {
          name: "John Smith",
          title: "Chief Executive Officer",
          bio: `Experienced leader with a strong background in the ${companyData.basic_info.industry} sector.`
        },
        executives: [
          {
            name: "Jane Doe",
            title: "Chief Technology Officer",
            bio: "Technology visionary with 15+ years of experience."
          },
          {
            name: "Michael Johnson",
            title: "Chief Financial Officer",
            bio: "Financial expert with a background in investment banking."
          }
        ]
      },
      conversation_starters: [
        `How is ${companyData.basic_info.name} adapting to recent trends in the ${companyData.basic_info.industry} industry?`,
        `What challenges is your team facing with current tools in the market?`,
        `How does your team currently handle customer feedback and surveys?`,
        `Would you be interested in learning how SurveySparrow has helped similar companies in the ${companyData.basic_info.industry} sector?`
      ]
    };
    
    return enhancedData;
  } catch (error) {
    console.error('Error enhancing data with Gemini AI:', error);
    // Return original data if enhancement fails
    return companyData;
  }
}

/**
 * Generate conversation starters based on company data
 * @param {Object} companyData - Company data
 * @returns {Promise<Array>} - List of conversation starters
 */
async function generateConversationStarters(companyData) {
  try {
    console.log(`Generating conversation starters for: ${companyData.basic_info.name}`);
    
    // In a real implementation, this would make an actual API call to Gemini
    // For now, we'll return pre-defined conversation starters
    
    const industry = companyData.basic_info.industry || 'technology';
    const companyName = companyData.basic_info.name;
    
    return [
      `How is ${companyName} adapting to recent trends in the ${industry} industry?`,
      `What challenges is your team facing with current tools in the market?`,
      `How does your team currently handle customer feedback and surveys?`,
      `Would you be interested in learning how SurveySparrow has helped similar companies in the ${industry} sector?`,
      `What are your key priorities for improving customer experience this year?`
    ];
  } catch (error) {
    console.error('Error generating conversation starters:', error);
    return [
      'How does your team currently collect customer feedback?',
      'What tools are you using for customer surveys?',
      'Would you be interested in learning more about SurveySparrow?'
    ];
  }
}

module.exports = {
  enhanceCompanyData,
  generateConversationStarters
};
