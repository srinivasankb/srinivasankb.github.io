import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PublicIcon from '@mui/icons-material/Public';
import LinearProgress from '@mui/material/LinearProgress';

function KeyMetrics({ companyData }) {
  const { metrics } = companyData;
  
  // Helper function to format large numbers
  const formatNumber = (num) => {
    if (!num) return 'N/A';
    
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    
    return num.toString();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Key Metrics
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Employee Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(94, 114, 228, 0.1)'
          }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {formatNumber(metrics.employee_count)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employees
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {metrics.employee_range || ''}
            </Typography>
          </Box>
        </Grid>
        
        {/* Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(45, 206, 137, 0.1)'
          }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {metrics.annual_revenue ? `$${formatNumber(metrics.annual_revenue)}` : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Annual Revenue
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {metrics.revenue_range || ''}
            </Typography>
          </Box>
        </Grid>
        
        {/* Market Share */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(251, 99, 64, 0.1)'
          }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {metrics.market_share ? `${(metrics.market_share * 100).toFixed(1)}%` : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Market Share
            </Typography>
            {metrics.market_share && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.market_share * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="warning"
                />
              </Box>
            )}
          </Box>
        </Grid>
        
        {/* Global Ranking */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(17, 205, 239, 0.1)'
          }}>
            <PublicIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {metrics.global_ranking ? `#${formatNumber(metrics.global_ranking)}` : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Global Ranking
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {metrics.valuation ? `Valuation: ${metrics.valuation}` : ''}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default KeyMetrics;
