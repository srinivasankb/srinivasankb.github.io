import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CodeIcon from '@mui/icons-material/Code';
import BarChartIcon from '@mui/icons-material/BarChart';
import CampaignIcon from '@mui/icons-material/Campaign';
import StorageIcon from '@mui/icons-material/Storage';

function TechnologyStack({ companyData }) {
  const { technology_stack } = companyData;
  
  // If no technology stack data is available
  if (!technology_stack || 
      ((!technology_stack.marketing || technology_stack.marketing.length === 0) && 
       (!technology_stack.development || technology_stack.development.length === 0) && 
       (!technology_stack.analytics || technology_stack.analytics.length === 0) && 
       (!technology_stack.other || technology_stack.other.length === 0))) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Technology Stack
      </Typography>
      
      <Grid container spacing={2}>
        {/* Marketing Technologies */}
        {technology_stack.marketing && technology_stack.marketing.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CampaignIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  Marketing
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {technology_stack.marketing.map((tech, index) => (
                  <Chip key={index} label={tech} size="small" />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
        
        {/* Development Technologies */}
        {technology_stack.development && technology_stack.development.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CodeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  Development
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {technology_stack.development.map((tech, index) => (
                  <Chip key={index} label={tech} size="small" />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
        
        {/* Analytics Technologies */}
        {technology_stack.analytics && technology_stack.analytics.length > 0 && (
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BarChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  Analytics
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {technology_stack.analytics.map((tech, index) => (
                  <Chip key={index} label={tech} size="small" />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
        
        {/* Other Technologies */}
        {technology_stack.other && technology_stack.other.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StorageIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  Other
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {technology_stack.other.map((tech, index) => (
                  <Chip key={index} label={tech} size="small" />
                ))}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default TechnologyStack;
