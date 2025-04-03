import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function CompanyOverview({ companyData }) {
  const { basic_info, contact_info } = companyData;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={3}>
        {/* Company Logo */}
        <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Avatar
            src={basic_info.logo_url}
            alt={`${basic_info.name} logo`}
            sx={{ 
              width: 120, 
              height: 120, 
              boxShadow: 1,
              border: '1px solid #eee'
            }}
            variant="rounded"
          />
        </Grid>
        
        {/* Company Basic Info */}
        <Grid item xs={12} sm={9} md={10}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mr: 2 }}>
              {basic_info.name}
            </Typography>
            
            <Chip 
              label={basic_info.company_type} 
              color={basic_info.company_type === 'Public' ? 'success' : 'primary'} 
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            {basic_info.description}
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Founded: <strong>{basic_info.founded_year || 'Unknown'}</strong>
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CategoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Industry: <strong>{basic_info.industry || 'Unknown'}</strong>
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Sector: <strong>{basic_info.sector || 'Unknown'}</strong>
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  HQ: <strong>
                    {contact_info?.headquarters?.city && contact_info?.headquarters?.country 
                      ? `${contact_info.headquarters.city}, ${contact_info.headquarters.country}`
                      : 'Unknown'}
                  </strong>
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon color="primary" sx={{ mr: 1 }} />
                <Link href={basic_info.website_url} target="_blank" rel="noopener" underline="hover">
                  {basic_info.website_url}
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CompanyOverview;
