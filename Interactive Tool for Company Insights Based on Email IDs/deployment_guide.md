# Deployment Guide for SurveySparrow GTM Company Lookup Tool

This document provides instructions for deploying the SurveySparrow GTM Company Lookup Tool to production environments.

## Prerequisites

- Node.js (v16+)
- npm (v8+)
- A server with HTTPS support
- API keys for:
  - AbstractAPI
  - Clearbit (optional)
  - Gemini AI (optional)

## Deployment Options

### Option 1: Traditional Server Deployment

1. Clone the repository to your server
2. Install dependencies:
   ```
   npm install --production
   ```
3. Create a `.env` file with your production settings:
   ```
   PORT=5000
   NODE_ENV=production
   ABSTRACT_API_KEY=your_abstract_api_key_here
   CLEARBIT_API_KEY=your_clearbit_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Build the frontend:
   ```
   npm run build
   ```
5. Start the server:
   ```
   npm start
   ```

### Option 2: Docker Deployment

1. Build the Docker image:
   ```
   docker build -t surveysparrow-company-lookup .
   ```
2. Run the container:
   ```
   docker run -p 5000:5000 -e ABSTRACT_API_KEY=your_key -e CLEARBIT_API_KEY=your_key -e GEMINI_API_KEY=your_key surveysparrow-company-lookup
   ```

### Option 3: Cloud Platform Deployment

#### Heroku
1. Create a new Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Heroku Git:
   ```
   heroku git:remote -a your-app-name
   git push heroku main
   ```

#### AWS Elastic Beanstalk
1. Create a new Elastic Beanstalk environment
2. Configure environment variables
3. Deploy using EB CLI:
   ```
   eb init
   eb create
   eb deploy
   ```

## SSL Configuration

For production environments, always use HTTPS. You can:
- Use a reverse proxy like Nginx
- Configure SSL certificates with Let's Encrypt
- Use your cloud provider's SSL options

## Monitoring and Maintenance

- Set up application monitoring using tools like New Relic or Datadog
- Configure error logging and alerting
- Implement regular backups of any persistent data
- Schedule regular API key rotation

## Scaling Considerations

- Implement rate limiting for API endpoints
- Consider using a CDN for static assets
- Set up load balancing for high-traffic scenarios
- Optimize caching strategies for API responses
