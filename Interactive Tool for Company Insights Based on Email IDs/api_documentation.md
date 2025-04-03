# API Documentation: SurveySparrow GTM Company Lookup Tool

This document provides detailed information about the API endpoints available in the SurveySparrow GTM Company Lookup Tool.

## Base URL

All API endpoints are relative to the base URL:
```
https://your-deployment-url.com/api
```

## Authentication

Currently, the API does not require authentication as it's designed for internal use. If deploying publicly, consider implementing an authentication mechanism.

## Endpoints

### Extract Domain from Email

Extracts the domain from a business email address.

**URL**: `/extract-domain`

**Method**: `POST`

**Request Body**:
```json
{
  "email": "example@company.com"
}
```

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "email": "example@company.com",
    "domain": "company.com"
  }
}
```

**Error Response**:
- **Code**: 400 Bad Request
- **Content**:
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

### Get Company Data

Retrieves comprehensive company information based on domain.

**URL**: `/company/:domain`

**Method**: `GET`

**URL Parameters**:
- `domain`: The company domain (e.g., `google.com`)

**Query Parameters**:
- `symbol` (optional): Stock symbol for public companies

**Success Response**:
- **Code**: 200 OK
- **Content**:
```json
{
  "success": true,
  "data": {
    "basic_info": {
      "domain": "company.com",
      "name": "Company Name",
      "logo_url": "https://logo.clearbit.com/company.com",
      "description": "Company description...",
      "founded_year": 2010,
      "company_type": "Private",
      "industry": "Technology",
      "sector": "Software",
      "website_url": "https://www.company.com",
      "last_updated": "2025-04-03T09:55:48.229Z"
    },
    "contact_info": {
      "headquarters": {
        "street": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "country": "United States",
        "postal_code": "94105"
      },
      "phone_numbers": ["(555) 123-4567"],
      "email_addresses": ["contact@company.com"],
      "social_media": {
        "linkedin": "https://linkedin.com/company/company",
        "twitter": "https://twitter.com/company",
        "facebook": "https://facebook.com/company",
        "instagram": "https://instagram.com/company"
      }
    },
    "metrics": {
      "employee_count": 500,
      "employee_range": "251-1000",
      "annual_revenue": 50000000,
      "revenue_range": "$10M-$100M",
      "market_share": 0.05,
      "global_ranking": 5000,
      "valuation": "$500M"
    },
    "geographic_presence": {
      "headquarters_location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "regions": ["North America", "Europe", "Asia"],
      "countries": ["United States", "United Kingdom", "Germany", "Japan"]
    },
    "technology_stack": {
      "marketing": ["HubSpot", "Marketo", "Google Analytics"],
      "development": ["React", "Node.js", "AWS"],
      "analytics": ["Mixpanel", "Amplitude", "Tableau"],
      "other": ["Slack", "Zoom", "Asana"]
    },
    "leadership": {
      "ceo": {
        "name": "John Smith",
        "title": "Chief Executive Officer",
        "bio": "Experienced leader with a strong background in the Technology sector."
      },
      "executives": [
        {
          "name": "Jane Doe",
          "title": "Chief Technology Officer",
          "bio": "Technology visionary with 15+ years of experience."
        },
        {
          "name": "Michael Johnson",
          "title": "Chief Financial Officer",
          "bio": "Financial expert with a background in investment banking."
        }
      ]
    },
    "conversation_starters": [
      "How is your company adapting to recent trends in the Technology industry?",
      "What challenges is your team facing with current tools in the market?",
      "How does your team currently handle customer feedback and surveys?",
      "Would you be interested in learning how SurveySparrow has helped similar companies in your sector?",
      "What are your key priorities for improving customer experience this year?"
    ]
  }
}
```

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "success": false,
  "error": "Company not found for domain: unknown-domain.com"
}
```

### Refresh Company Data

Forces a refresh of company data, bypassing cache.

**URL**: `/company/:domain/refresh`

**Method**: `POST`

**URL Parameters**:
- `domain`: The company domain (e.g., `google.com`)

**Query Parameters**:
- `symbol` (optional): Stock symbol for public companies

**Success Response**:
- **Code**: 200 OK
- **Content**: Same as Get Company Data endpoint

**Error Response**:
- **Code**: 404 Not Found
- **Content**:
```json
{
  "success": false,
  "error": "Company not found for domain: unknown-domain.com"
}
```

## Data Models

### Company Data Structure

The company data object returned by the API contains the following sections:

- **basic_info**: General company information
- **contact_info**: Contact details and social media links
- **metrics**: Key business metrics and statistics
- **geographic_presence**: Location information
- **technology_stack**: Technologies used by the company
- **leadership**: Information about company executives
- **conversation_starters**: AI-generated conversation prompts

## Rate Limiting

The API currently does not implement rate limiting, but external APIs used by the service may have their own rate limits. Consider implementing rate limiting for production deployments.

## Error Handling

All API endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common error codes:
- 400: Bad Request - Invalid input parameters
- 404: Not Found - Resource not found
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Server-side issue

## Extending the API

To add new endpoints or functionality:
1. Create new route handlers in the appropriate files under `src/backend/`
2. Update this documentation to reflect the changes
3. Test thoroughly before deploying to production
