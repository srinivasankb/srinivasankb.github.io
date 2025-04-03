# Developer Guide: SurveySparrow GTM Company Lookup Tool

This guide provides technical information for developers who will maintain and extend the SurveySparrow GTM Company Lookup Tool.

## Project Structure

```
company_lookup_tool/
├── src/
│   ├── backend/
│   │   ├── server.js             # Main Express server
│   │   └── services/             # Backend services
│   │       ├── abstractApiService.js
│   │       ├── clearbitService.js
│   │       ├── yahooFinanceService.js
│   │       ├── geminiAiService.js
│   │       ├── dataIntegrationService.js
│   │       └── cacheService.js
│   └── frontend/
│       ├── index.html            # Main HTML file
│       ├── index.js              # Entry point
│       ├── components/           # React components
│       │   ├── App.js
│       │   ├── Header.js
│       │   ├── SearchPage.js
│       │   ├── CompanyDashboard.js
│       │   └── dashboard/        # Dashboard components
│       │       ├── CompanyOverview.js
│       │       ├── KeyMetrics.js
│       │       ├── LeadershipTeam.js
│       │       ├── FinancialOverview.js
│       │       ├── NewsUpdates.js
│       │       ├── GeographicPresence.js
│       │       ├── TechnologyStack.js
│       │       ├── SocialMedia.js
│       │       └── ConversationStarters.js
│       ├── styles/               # CSS styles
│       └── utils/                # Utility functions
│           └── api.js            # API client
├── deployment/                   # Deployment resources
├── .env                          # Environment variables
├── .env.example                  # Example environment file
├── package.json                  # Project dependencies
├── vite.config.js                # Vite configuration
└── README.md                     # Project overview
```

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Axios**: HTTP client for API requests
- **Dotenv**: Environment variable management

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Material UI**: Component library
- **Chart.js**: Data visualization
- **Leaflet**: Interactive maps

### Development Tools
- **Vite**: Build tool and development server
- **Nodemon**: Auto-restart for backend development
- **Concurrently**: Run multiple commands simultaneously

## Key Concepts

### Data Flow

1. User enters a business email address
2. Frontend sends request to extract domain
3. Backend extracts domain from email
4. Frontend requests company data for the domain
5. Backend:
   - Checks cache for existing data
   - If not cached, fetches data from external APIs
   - Integrates data from multiple sources
   - Caches results
   - Returns comprehensive company data
6. Frontend renders data in interactive dashboard

### API Integration

The application integrates with multiple external APIs:

- **AbstractAPI**: Primary source for company data
- **Clearbit**: Additional company information
- **Yahoo Finance**: Financial data for public companies
- **Gemini AI**: Generates conversation starters and enhances data

Each API has its own service module in `src/backend/services/`.

### Caching Strategy

To improve performance and reduce API calls:

- Company data is cached in memory
- Cache expiration is set to 24 hours by default
- Forced refresh bypasses cache
- Cache is cleared on server restart

## Extending the Application

### Adding New Data Sources

1. Create a new service file in `src/backend/services/`
2. Implement the API client and data transformation
3. Update `dataIntegrationService.js` to include the new data source
4. Add any new environment variables to `.env.example`

### Adding New Dashboard Sections

1. Create a new component in `src/frontend/components/dashboard/`
2. Import and add the component to `CompanyDashboard.js`
3. Update data models if necessary

### Modifying API Endpoints

1. Update the relevant route handler in `src/backend/server.js`
2. Update the API client in `src/frontend/utils/api.js`
3. Update API documentation

## Common Development Tasks

### Adding Dependencies

```bash
npm install package-name
```

### Running in Development Mode

```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend
```

### Building for Production

```bash
npm run build
```

### Updating API Keys

Edit the `.env` file to update API keys:

```
ABSTRACT_API_KEY=new_key_here
CLEARBIT_API_KEY=new_key_here
GEMINI_API_KEY=new_key_here
```

## Troubleshooting

### Common Issues

**API Rate Limiting**
- Check the response from external APIs for rate limit errors
- Implement exponential backoff for retries
- Consider upgrading API plans for higher limits

**Memory Usage**
- Monitor server memory usage if caching large amounts of data
- Implement cache size limits or LRU caching if needed

**Frontend Build Issues**
- Check for JSX syntax errors
- Verify Vite configuration
- Clear node_modules and reinstall dependencies

### Debugging

- Backend logs are output to the console
- Use browser developer tools for frontend debugging
- Check network requests in browser dev tools to verify API calls

## Performance Optimization

- Implement server-side rendering for improved initial load
- Add pagination for large data sets
- Optimize images and assets
- Consider implementing a service worker for offline capabilities

## Security Considerations

- Implement proper authentication for production
- Sanitize user inputs
- Keep API keys secure
- Set up CORS properly for production
- Use HTTPS for all production deployments
