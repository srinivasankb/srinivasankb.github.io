# SurveySparrow Company Lookup Tool - Data Structure Design

## Overview
This document outlines the data structure and API integration plan for the SurveySparrow GTM team's company lookup tool. The tool will retrieve and organize company information from multiple data sources based on business email domains.

## Data Flow Architecture

### 1. Input Processing
- Extract domain from email address (e.g., extract "company.com" from "user@company.com")
- Validate domain format and existence
- Check cache for recent lookups of the same domain

### 2. Data Retrieval Layer
- **Primary Data Source**: AbstractAPI Company Enrichment API
- **Supplementary Sources**:
  - Clearbit Name to Domain API (for domain verification/resolution)
  - Yahoo Finance API (for public company financial data)
  - Gemini 2.0 Flash Lite AI (for data enhancement and gap filling)
- **Fallback Mechanism**: If primary API fails, attempt retrieval from secondary sources

### 3. Data Integration Layer
- Combine data from multiple sources
- Resolve conflicts with priority rules
- Fill gaps in information using AI enhancement
- Normalize data formats for consistent presentation

### 4. Data Caching Layer
- Store retrieved company data in local cache
- Set appropriate TTL (Time To Live) for cached data
- Implement cache invalidation strategy for data freshness

## Data Models

### 1. Company Profile Model
```json
{
  "basic_info": {
    "domain": "company.com",
    "name": "Company Name",
    "logo_url": "https://logo.clearbit.com/company.com",
    "description": "Company description text",
    "founded_year": 2010,
    "company_type": "Public|Private|Nonprofit",
    "industry": "Technology",
    "sector": "Software",
    "website_url": "https://www.company.com",
    "last_updated": "2025-04-03T09:00:00Z"
  },
  
  "contact_info": {
    "headquarters": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "country": "United States",
      "postal_code": "94105"
    },
    "phone_numbers": ["123-456-7890"],
    "email_addresses": ["contact@company.com"],
    "social_media": {
      "linkedin": "https://linkedin.com/company/company",
      "twitter": "https://twitter.com/company",
      "facebook": "https://facebook.com/company",
      "instagram": "https://instagram.com/company"
    }
  },
  
  "metrics": {
    "employee_count": 5000,
    "employee_range": "1K-10K",
    "annual_revenue": 500000000,
    "revenue_range": "$100M-$1B",
    "market_share": 0.15,
    "global_ranking": 1234,
    "valuation": "5B-10B"
  },
  
  "geographic_presence": {
    "headquarters_location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "regions": ["North America", "Europe", "Asia"],
    "countries": ["US", "UK", "DE", "JP", "SG"]
  },
  
  "leadership": {
    "ceo": {
      "name": "Jane Smith",
      "title": "Chief Executive Officer",
      "bio": "Brief bio text",
      "photo_url": "https://example.com/jane-smith.jpg"
    },
    "executives": [
      {
        "name": "John Doe",
        "title": "Chief Technology Officer",
        "bio": "Brief bio text"
      },
      // Additional executives
    ],
    "board_members": [
      // Board member objects
    ]
  },
  
  "financial_data": {
    "is_public": true,
    "stock_info": {
      "ticker": "COMP",
      "exchange": "NASDAQ",
      "current_price": 156.78,
      "market_cap": 78000000000
    },
    "financial_ratios": {
      "pe_ratio": 25.4,
      "revenue_growth": 0.12
      // Additional financial metrics
    },
    "funding": {
      "total_funding": 250000000,
      "latest_round": {
        "date": "2023-06-15",
        "amount": 75000000,
        "round_type": "Series D",
        "investors": ["Investor A", "Investor B"]
      },
      "funding_rounds": [
        // Previous funding rounds
      ]
    }
  },
  
  "news_and_updates": {
    "recent_news": [
      {
        "title": "Company Launches New Product",
        "date": "2025-03-15",
        "source": "TechCrunch",
        "url": "https://techcrunch.com/article/123",
        "summary": "Brief summary of the news"
      },
      // Additional news items
    ],
    "press_releases": [
      // Press release objects
    ],
    "major_announcements": [
      // Announcement objects
    ]
  },
  
  "technology_stack": {
    "marketing": ["HubSpot", "Marketo"],
    "development": ["React", "Node.js", "AWS"],
    "analytics": ["Google Analytics", "Mixpanel"],
    "other": ["Slack", "Zoom"]
  }
}
```

### 2. Search History Model
```json
{
  "user_id": "user123",
  "search_timestamp": "2025-04-03T09:15:00Z",
  "email_searched": "contact@company.com",
  "domain_extracted": "company.com",
  "search_successful": true,
  "data_sources_used": ["AbstractAPI", "YahooFinance"]
}
```

### 3. User Notes Model
```json
{
  "user_id": "user123",
  "company_domain": "company.com",
  "notes": "Potential enterprise customer, interested in our premium plan",
  "created_at": "2025-04-03T09:30:00Z",
  "updated_at": "2025-04-03T09:45:00Z"
}
```

## API Integration Details

### 1. AbstractAPI Company Enrichment
- **Endpoint**: `https://companyenrichment.abstractapi.com/v1/`
- **Authentication**: API Key in query parameter
- **Request Format**: 
  ```
  GET https://companyenrichment.abstractapi.com/v1/?api_key=YOUR_API_KEY&domain=company.com
  ```
- **Response Handling**: Map to Company Profile Model basic_info, contact_info, and metrics sections

### 2. Clearbit Name to Domain API
- **Endpoint**: `https://company.clearbit.com/v1/domains/find`
- **Authentication**: API Key in header
- **Request Format**:
  ```
  GET https://company.clearbit.com/v1/domains/find?name=Company%20Name
  ```
- **Response Handling**: Used primarily for domain verification and logo retrieval

### 3. Yahoo Finance API
- **Endpoints**: Multiple endpoints from datasource module
- **Authentication**: Handled by datasource module
- **Request Format**: Use datasource module API client
- **Response Handling**: Map to Company Profile Model financial_data and news_and_updates sections

### 4. Gemini 2.0 Flash Lite AI
- **Integration Method**: API calls to Gemini service
- **Prompt Engineering**: Structure prompts to request specific company information
- **Response Processing**: Parse structured data from AI responses
- **Use Cases**:
  - Fill gaps in company descriptions
  - Generate executive summaries
  - Create conversation starters for GTM team
  - Enhance news summaries

## Caching Strategy
- **Cache Duration**: 24 hours for basic company data
- **Real-time Data**: Financial data and news refreshed on each request
- **Cache Invalidation**: Manual refresh button for users
- **Storage Method**: Local database with JSON serialization

## Error Handling
- **API Failures**: Graceful degradation with partial data display
- **Domain Not Found**: Suggest similar domains or company name search
- **Rate Limiting**: Queue requests and notify user of delay
- **Data Inconsistency**: Prioritize most reliable source based on data type

## Security Considerations
- **API Key Management**: Server-side storage of all API keys
- **Data Privacy**: No storage of personal information from email addresses
- **Access Control**: User authentication for accessing the tool
- **Data Retention**: Clear search history older than 30 days
