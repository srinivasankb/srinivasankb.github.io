import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EventIcon from '@mui/icons-material/Event';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';

function NewsUpdates({ companyData }) {
  const { news_and_updates } = companyData;
  
  // If no news data is available
  if (!news_and_updates || !news_and_updates.recent_news || news_and_updates.recent_news.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          News & Updates
        </Typography>
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No recent news available
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        News & Updates
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {news_and_updates.recent_news.map((news, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <NewspaperIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link href={news.url || '#'} target="_blank" rel="noopener" underline="hover">
                    {news.title}
                  </Link>
                }
                secondary={
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {news.date}
                      </Typography>
                      <Chip 
                        label={news.source} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {news.summary}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < news_and_updates.recent_news.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Link 
          href={`https://news.google.com/search?q=${companyData.basic_info.name}`} 
          target="_blank" 
          rel="noopener"
          underline="hover"
        >
          View more news →
        </Link>
      </Box>
    </Paper>
  );
}

export default NewsUpdates;
