import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { extractDomain, getCompanyData } from '../utils/api';

function SearchPage({ setCompanyData, setLoading, setError }) {
  const [email, setEmail] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setLocalError('Please enter a business email address');
      return;
    }
    
    try {
      setLocalLoading(true);
      setLocalError(null);
      
      // Extract domain from email
      const response = await extractDomain(email);
      const { domain } = response.data;
      
      // Add to recent searches
      if (!recentSearches.includes(domain)) {
        const updatedSearches = [domain, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
      
      // Set global loading state
      setLoading(true);
      
      // Fetch company data
      const companyResponse = await getCompanyData(domain);
      
      // Update global state
      setCompanyData(companyResponse.data);
      setLoading(false);
      setError(null);
      
      // Navigate to company dashboard
      navigate(`/company/${domain}`);
    } catch (error) {
      console.error('Error:', error);
      setLocalError(error.response?.data?.error || 'An error occurred while processing your request');
      setLoading(false);
      setError(error.response?.data?.error || 'An error occurred while processing your request');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRecentSearch = (domain) => {
    setEmail(`example@${domain}`);
  };

  // Load recent searches from localStorage on component mount
  React.useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Get Detailed Company Intelligence
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Enter a business email address to retrieve comprehensive information about the company
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4, 
            borderRadius: 2,
            backgroundColor: '#fff' 
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Business Email Address"
              variant="outlined"
              placeholder="Enter business email address..."
              value={email}
              onChange={handleEmailChange}
              error={!!localError}
              helperText={localError}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={localLoading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              disabled={localLoading}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {localLoading ? 'Looking up...' : 'Lookup Company'}
            </Button>
          </form>
          
          {recentSearches.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Recent Searches:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {recentSearches.map((domain, index) => (
                  <Button 
                    key={index} 
                    size="small" 
                    variant="outlined" 
                    onClick={() => handleRecentSearch(domain)}
                  >
                    {domain}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This tool helps SurveySparrow GTM team gather intelligence about prospects and customers.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default SearchPage;
