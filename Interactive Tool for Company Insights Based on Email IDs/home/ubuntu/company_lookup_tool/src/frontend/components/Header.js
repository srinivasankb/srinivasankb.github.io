import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box 
            component="img" 
            sx={{ 
              height: 40, 
              mr: 2, 
              cursor: 'pointer' 
            }}
            alt="SurveySparrow Logo"
            src="https://surveysparrow.com/wp-content/themes/surveysparrow/images/logo-white.svg"
            onClick={handleLogoClick}
          />
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={handleLogoClick}
          >
            Company Intelligence Tool
          </Typography>
          
          <IconButton sx={{ p: 0 }}>
            <Avatar alt="User Profile" src="/static/images/avatar/1.jpg" />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
