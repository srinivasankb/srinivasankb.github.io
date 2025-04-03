import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import SearchPage from './SearchPage';
import CompanyDashboard from './CompanyDashboard';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#5E72E4',
    },
    secondary: {
      main: '#11cdef',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route 
          path="/" 
          element={
            <SearchPage 
              setCompanyData={setCompanyData} 
              setLoading={setLoading} 
              setError={setError} 
            />
          } 
        />
        <Route 
          path="/company/:domain" 
          element={
            <CompanyDashboard 
              companyData={companyData} 
              loading={loading} 
              error={error}
              setLoading={setLoading}
              setError={setError}
              setCompanyData={setCompanyData}
            />
          } 
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
