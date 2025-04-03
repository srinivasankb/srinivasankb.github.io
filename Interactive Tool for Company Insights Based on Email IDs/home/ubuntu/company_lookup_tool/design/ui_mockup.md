# SurveySparrow Company Lookup Tool - UI Design Mockup

## Overview
This document outlines the user interface design for the SurveySparrow GTM team's company lookup tool. The tool will allow team members to enter a business email address and retrieve comprehensive information about the company associated with that email domain.

## User Interface Components

### 1. Header Section
- **Logo**: SurveySparrow logo on the top left
- **Title**: "Company Intelligence Tool" centered
- **User Info**: User profile icon on the top right

### 2. Search Section
- **Email Input Field**: Large, centered input box with placeholder text "Enter business email address..."
- **Search Button**: Prominent "Lookup Company" button with search icon
- **Recent Searches**: Small dropdown showing recent email domains searched (limited to 5)

### 3. Loading State
- **Progress Indicator**: Circular progress animation
- **Status Message**: "Gathering company intelligence..."
- **Company Logo**: If available, show the company logo while loading

### 4. Results Dashboard
The results will be displayed in an interactive dashboard with the following sections:

#### 4.1 Company Overview Card
- Company logo (large)
- Company name (large, bold)
- Tagline/description
- Founded year
- Company type (Public/Private)
- Industry/Sector
- Website URL (clickable)
- Headquarters location

#### 4.2 Key Metrics Section
- **Employee Count**: Visual representation with icon and number
- **Revenue**: Visual representation with icon and range/amount
- **Market Share**: Percentage with visual indicator
- **Global Ranking**: Position with visual indicator
- **Valuation**: For private companies, estimated valuation range

#### 4.3 Geographic Presence
- Interactive map showing company locations
- List of regions/countries where the company operates
- Headquarters highlighted differently from other locations

#### 4.4 Leadership Team
- CEO photo and name (if available)
- Key executives with titles and brief bios
- Board members (if applicable)
- Option to expand for more team members

#### 4.5 Financial Overview (if public company)
- Stock ticker and current price
- Stock performance chart (last 6 months)
- Key financial ratios
- Market cap

#### 4.6 Recent News & Updates
- Timeline of recent news articles
- Press releases
- Major announcements
- Funding rounds (if applicable)

#### 4.7 Technology Stack
- List of technologies used by the company
- Categorized by type (marketing, development, etc.)

#### 4.8 Social Media Presence
- Links to company social media profiles
- Follower counts
- Recent activity summary

### 5. Action Panel
- **Save Report**: Button to save the company profile as PDF
- **Share**: Button to share the company profile via email
- **Add Notes**: Section for GTM team to add their own notes about the company
- **Conversation Starters**: AI-generated talking points based on company data

### 6. Footer
- Data source attribution
- Last updated timestamp
- Help/Support link
- Feedback button

## Color Scheme and Visual Design
- Primary color: SurveySparrow brand color (#5E72E4)
- Secondary colors: Complementary palette for different sections
- White background with subtle shadows for cards
- Data visualizations in brand-compatible colors
- Clean, modern typography with good readability

## Responsive Design Considerations
- Desktop-first design optimized for sales team use
- Tablet-friendly layout with minimal adjustments
- Mobile view with collapsible sections for field use

## Interaction Design
- Smooth transitions between states
- Expandable/collapsible sections for detailed information
- Hover states for interactive elements
- Tooltips for additional context on data points
- Click-through capabilities for drilling down into specific data

## Accessibility Features
- High contrast mode option
- Keyboard navigation support
- Screen reader compatible elements
- Text size adjustment controls

## Technical Implementation Notes
- Frontend framework: React.js for component-based UI
- Data visualization: D3.js or Chart.js for interactive charts
- Map visualization: Mapbox or Google Maps API
- Responsive framework: Bootstrap or Tailwind CSS
