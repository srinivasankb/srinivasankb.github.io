import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

function SocialMedia({ companyData }) {
  const { contact_info } = companyData;
  
  // If no social media data is available
  if (!contact_info || !contact_info.social_media || 
      (!contact_info.social_media.linkedin && 
       !contact_info.social_media.twitter && 
       !contact_info.social_media.facebook && 
       !contact_info.social_media.instagram)) {
    return null;
  }

  const { social_media } = contact_info;

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Social Media
      </Typography>
      
      <List>
        {social_media.linkedin && (
          <ListItem component={Link} href={social_media.linkedin} target="_blank" rel="noopener" underline="none">
            <ListItemIcon>
              <LinkedInIcon sx={{ color: '#0077B5' }} />
            </ListItemIcon>
            <ListItemText primary="LinkedIn" />
          </ListItem>
        )}
        
        {social_media.twitter && (
          <ListItem component={Link} href={social_media.twitter} target="_blank" rel="noopener" underline="none">
            <ListItemIcon>
              <TwitterIcon sx={{ color: '#1DA1F2' }} />
            </ListItemIcon>
            <ListItemText primary="Twitter" />
          </ListItem>
        )}
        
        {social_media.facebook && (
          <ListItem component={Link} href={social_media.facebook} target="_blank" rel="noopener" underline="none">
            <ListItemIcon>
              <FacebookIcon sx={{ color: '#4267B2' }} />
            </ListItemIcon>
            <ListItemText primary="Facebook" />
          </ListItem>
        )}
        
        {social_media.instagram && (
          <ListItem component={Link} href={social_media.instagram} target="_blank" rel="noopener" underline="none">
            <ListItemIcon>
              <InstagramIcon sx={{ color: '#E1306C' }} />
            </ListItemIcon>
            <ListItemText primary="Instagram" />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}

export default SocialMedia;
