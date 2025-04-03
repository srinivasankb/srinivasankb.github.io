# Company Lookup Tool Research

## API Options for Company Data Lookup

### 1. AbstractAPI Company Enrichment API
- **URL**: https://www.abstractapi.com/api/company-enrichment
- **Free Tier**: 100 requests per month
- **Pricing**: $12/month for 12,000 requests per year (paid annually)
- **Features**:
  - Lookup company data by domain name
  - Returns comprehensive company information:
    - Company name and description
    - Logo URL
    - Founding year
    - Address and location data (street, city, state, country, coordinates)
    - Industry classification
    - Employee count and range
    - Annual revenue and range
    - Phone numbers and email addresses
    - Company type (public/private)
    - Stock ticker and exchange (if applicable)
    - Global ranking
    - Social media links (LinkedIn, Facebook, Twitter, Instagram)
    - Technologies used
- **Pros**:
  - Comprehensive company data
  - Simple REST API
  - Free tier available for testing
  - Reasonable pricing for paid tier
  - Good documentation and SDKs
- **Cons**:
  - Limited to 100 requests in free tier
  - May not include recent news or updates

### 2. WhoisXML API
- **URL**: https://whois.whoisxmlapi.com/lookup
- **Free Tier**: 500 monthly queries (from search results)
- **Pricing**: Starts at $30/month for 2,000 queries
- **Features**:
  - WHOIS lookup for domains, IPs, and email addresses
  - Registration information for domains
  - Historical WHOIS data
- **Pros**:
  - Extensive domain registration data
  - Historical data available
  - Good for ownership verification
- **Cons**:
  - Focuses more on domain registration than company details
  - May not provide comprehensive business information
  - Higher pricing compared to AbstractAPI

### 3. Clearbit Name to Domain API
- **URL**: https://clearbit.com/blog/company-name-to-domain-api
- **Free Tier**: Up to 50,000 requests per month
- **Features**:
  - Convert company name to domain name
  - Returns company domain and logo
- **Pros**:
  - Very generous free tier
  - Simple API
  - Good for mapping company names to domains
- **Cons**:
  - Limited data (only returns domain and logo)
  - Not suitable as primary data source for comprehensive company information
  - Requires additional APIs for complete company data

### 4. Gemini 2.0 Flash Lite AI
- **Description**: AI model that can be used to generate company information
- **Features**:
  - Can process and analyze company data from various sources
  - Capable of generating structured information about companies
  - Can potentially combine information from multiple sources
- **Pros**:
  - Flexible approach that doesn't rely solely on specific APIs
  - Can potentially fill gaps in data from other sources
  - May provide more contextual information
- **Cons**:
  - May require additional validation for accuracy
  - Implementation complexity compared to direct API calls
  - Response format may need additional processing

## Recommended API Combination

For the SurveySparrow GTM tool, we recommend using a combination of:

1. **AbstractAPI Company Enrichment API** as the primary data source for comprehensive company information
   - This will provide most of the required data: industry, location, employee count, leadership, etc.

2. **Clearbit Name to Domain API** as a supplementary service
   - Can be used to convert company names to domains when only the company name is available
   - The generous free tier (50k requests/month) makes it ideal for high-volume use

3. **Yahoo Finance API** (from datasource module)
   - Can be used to supplement financial data, stock information, and recent news for public companies
   - Will provide additional depth for publicly traded companies

4. **Gemini 2.0 Flash Lite AI** as a fallback and enhancement option
   - Can be used to fill gaps in information not provided by the APIs
   - May help with generating more contextual information about companies
   - Could potentially combine and synthesize data from multiple sources

## Next Steps

1. Design a web interface that allows users to enter a business email
2. Extract the domain from the email address
3. Use AbstractAPI to fetch comprehensive company data
4. Use Yahoo Finance API to supplement with financial data and news (for public companies)
5. Consider using Gemini 2.0 Flash Lite AI to enhance and fill gaps in the data
6. Present the information in an interactive, structured format
