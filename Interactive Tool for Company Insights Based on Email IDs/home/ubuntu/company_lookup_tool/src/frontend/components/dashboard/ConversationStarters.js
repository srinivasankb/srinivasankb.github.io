import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function ConversationStarters({ companyData }) {
  const [open, setOpen] = React.useState(false);
  
  // Check if conversation starters exist
  if (!companyData.conversation_starters || companyData.conversation_starters.length === 0) {
    return null;
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <QuestionAnswerIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Conversation Starters
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Use these tailored questions to engage with the prospect
      </Typography>
      
      <List>
        {companyData.conversation_starters.map((starter, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <LightbulbIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={starter}
                secondary={
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopy(starter)}
                    sx={{ mt: 1 }}
                  >
                    Copy
                  </Button>
                }
              />
            </ListItem>
            {index < companyData.conversation_starters.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ConversationStarters;
