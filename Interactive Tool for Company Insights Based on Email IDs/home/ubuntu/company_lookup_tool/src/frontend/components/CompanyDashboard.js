import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyData, refreshCompanyData } from '../utils/api';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import CompanyOverview from './dashboard/CompanyOverview';
import KeyMetrics from './dashboard/KeyMetrics';
import LeadershipTeam from './dashboard/LeadershipTeam';
import FinancialOverview from './dashboard/FinancialOverview';
import NewsUpdates from './dashboard/NewsUpdates';
import GeographicPresence from './dashboard/GeographicPresence';
import TechnologyStack from './dashboard/TechnologyStack';
import SocialMedia from './dashboard/SocialMedia';
import ConversationStarters from './dashboard/ConversationStarters';

function CompanyDashboard({ companyData, loading, error, setCompanyData, setLoading, setError }) {
  const { domain } = useParams();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch company data if not already available
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyData && domain) {
        try {
          setLoading(true);
          const response = await getCompanyData(domain);
          setCompanyData(response.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching company data:', err);
          setError(err.response?.data?.error || 'Failed to fetch company data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompanyData();
  }, [domain, companyData, setCompanyData, setLoading, setError]);

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await refreshCompanyData(domain);
      setCompanyData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error refreshing company data:', err);
      setError(err.response?.data?.error || 'Failed to refresh company data');
    } finally {
      setRefreshing(false);
    }
  };

  // Handle save report button click
  const handleSaveReport = () => {
    // In a real implementation, this would generate a PDF report
    alert('Report generation feature would be implemented here');
  };

  // Handle share button click
  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    alert('Share feature would be implemented here');
  };

  // Handle add notes button click
  const handleAddNotes = () => {
    // In a real implementation, this would open a notes dialog
    alert('Notes feature would be implemented here');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Gathering company intelligence...
          </Typography>
          {domain && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body1">Looking up information for</Typography>
              <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                {domain}
              </Typography>
              <Box 
                component="img"
                src={`https://logo.clearbit.com/${domain}`}
                alt={`${domain} logo`}
                sx={{ 
                  mt: 3, 
                  maxWidth: 150, 
                  maxHeight: 150,
                  borderRadius: 2,
                  boxShadow: 1
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/')}>
            Try Another Email
          </Button>
        </Box>
      </Container>
    );
  }

  if (!companyData) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ mr: 1 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            onClick={handleSaveReport}
            sx={{ mr: 1 }}
          >
            Save Report
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />} 
            onClick={handleShare}
            sx={{ mr: 1 }}
          >
            Share
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<NoteAddIcon />} 
            onClick={handleAddNotes}
          >
            Add Notes
          </Button>
        </Box>

        {/* Company Overview */}
        <CompanyOverview companyData={companyData} />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Key Metrics */}
            <KeyMetrics companyData={companyData} />
            
            {/* Financial Overview (if public company) */}
            {companyData.financial_data?.is_public && (
              <FinancialOverview companyData={companyData} />
            )}
            
            {/* Geographic Presence */}
            <GeographicPresence companyData={companyData} />
            
            {/* News & Updates */}
            <NewsUpdates companyData={companyData} />
          </Grid>
          
          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Leadership Team */}
            <LeadershipTeam companyData={companyData} />
            
            {/* Technology Stack */}
            <TechnologyStack companyData={companyData} />
            
            {/* Social Media Presence */}
            <SocialMedia companyData={companyData} />
            
            {/* Conversation Starters */}
            <ConversationStarters companyData={companyData} />
          </Grid>
        </Grid>
        
        {/* Footer */}
        <Paper sx={{ p: 2, mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Data sources: AbstractAPI, Yahoo Finance, Clearbit, and Gemini AI
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(companyData.basic_info.last_updated).toLocaleString()}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default CompanyDashboard;
