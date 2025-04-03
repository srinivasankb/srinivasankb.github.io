import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function LeadershipTeam({ companyData }) {
  const { leadership } = companyData;
  const [expanded, setExpanded] = React.useState(false);
  
  // If no leadership data is available
  if (!leadership || (!leadership.ceo && (!leadership.executives || leadership.executives.length === 0))) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Leadership Team
        </Typography>
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No leadership information available
          </Typography>
        </Box>
      </Paper>
    );
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Determine how many executives to show initially
  const initialExecCount = 2;
  const hasMoreExecs = leadership.executives && leadership.executives.length > initialExecCount;
  const displayedExecs = expanded 
    ? leadership.executives 
    : (leadership.executives || []).slice(0, initialExecCount);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Leadership Team
      </Typography>
      
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {/* CEO */}
        {leadership.ceo && (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {leadership.ceo.photo_url ? (
                  <Avatar alt={leadership.ceo.name} src={leadership.ceo.photo_url} />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                    {leadership.ceo.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', fontWeight: 'medium' }}
                    >
                      {leadership.ceo.title}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {leadership.ceo.bio}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        )}
        
        {/* Other Executives */}
        {displayedExecs.map((executive, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {executive.photo_url ? (
                  <Avatar alt={executive.name} src={executive.photo_url} />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                    {executive.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', fontWeight: 'medium' }}
                    >
                      {executive.title}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {executive.bio}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {(index < displayedExecs.length - 1 || hasMoreExecs) && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      
      {/* Show more/less button */}
      {hasMoreExecs && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button 
            size="small" 
            onClick={handleExpandClick}
            endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default LeadershipTeam;
