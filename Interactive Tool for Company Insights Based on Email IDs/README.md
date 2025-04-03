# SurveySparrow GTM Company Lookup Tool

A web-based tool that allows SurveySparrow's Go-To-Market team to enter business email addresses and retrieve comprehensive company information based on the email domain.

## Features

- Email domain extraction
- Comprehensive company data retrieval
- Interactive dashboard with multiple data sections:
  - Company overview
  - Key metrics
  - Leadership team
  - Financial data (for public companies)
  - News and updates
  - Geographic presence
  - Technology stack
  - Social media links
  - AI-generated conversation starters

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, Material UI
- **Data Sources**: AbstractAPI, Yahoo Finance, Clearbit, Gemini AI
- **Deployment**: Docker, Heroku, AWS (options)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   PORT=5000
   NODE_ENV=development
   ABSTRACT_API_KEY=your_abstract_api_key_here
   CLEARBIT_API_KEY=your_clearbit_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Development

- Backend code is in `src/backend/`
- Frontend code is in `src/frontend/`
- Run backend only: `npm run dev:backend`
- Run frontend only: `npm run dev:frontend`

## Deployment

See the [Deployment Guide](./deployment/deployment_guide.md) for detailed instructions on deploying to production environments.

## API Documentation

### Endpoints

- `POST /api/extract-domain`: Extract domain from email address
  - Request: `{ "email": "example@company.com" }`
  - Response: `{ "success": true, "data": { "email": "example@company.com", "domain": "company.com" } }`

- `GET /api/company/:domain`: Get company data by domain
  - Response: `{ "success": true, "data": { ... company data ... } }`

- `POST /api/company/:domain/refresh`: Refresh company data
  - Response: `{ "success": true, "data": { ... fresh company data ... } }`

## License

Proprietary - SurveySparrow Internal Use Only
