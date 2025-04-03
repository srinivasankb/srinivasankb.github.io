import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FinancialOverview({ companyData }) {
  const { financial_data } = companyData;
  
  // If no financial data is available or company is not public
  if (!financial_data || !financial_data.is_public) {
    return null;
  }

  // Mock stock price data for chart
  const stockData = {
    labels: ['6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago', '1 month ago', 'Current'],
    datasets: [
      {
        label: financial_data.stock_info?.ticker || 'Stock Price',
        data: [
          financial_data.stock_info?.current_price * 0.85,
          financial_data.stock_info?.current_price * 0.9,
          financial_data.stock_info?.current_price * 0.95,
          financial_data.stock_info?.current_price * 0.97,
          financial_data.stock_info?.current_price * 1.02,
          financial_data.stock_info?.current_price * 0.99,
          financial_data.stock_info?.current_price,
        ],
        borderColor: 'rgb(94, 114, 228)',
        backgroundColor: 'rgba(94, 114, 228, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  // Format market cap
  const formatMarketCap = (marketCap) => {
    if (!marketCap) return 'N/A';
    
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(2)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    }
    
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Financial Overview
        </Typography>
        <Chip 
          icon={<ShowChartIcon />} 
          label={`${financial_data.stock_info?.ticker || 'Stock'}: ${financial_data.stock_info?.exchange || ''}`} 
          color="primary" 
          variant="outlined"
        />
      </Box>
      
      <Grid container spacing={3}>
        {/* Stock Chart */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 250 }}>
            <Line options={chartOptions} data={stockData} />
          </Box>
        </Grid>
        
        {/* Financial Metrics */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Current Price
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  ${financial_data.stock_info?.current_price?.toFixed(2) || 'N/A'}
                </Typography>
                <Chip 
                  icon={financial_data.stock_info?.current_price > 100 ? <TrendingUpIcon /> : <TrendingDownIcon />} 
                  label={`${(Math.random() * 5).toFixed(2)}%`} 
                  color={financial_data.stock_info?.current_price > 100 ? "success" : "error"} 
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Market Cap
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {formatMarketCap(financial_data.stock_info?.market_cap)}
              </Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                P/E Ratio
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {financial_data.financial_ratios?.pe_ratio?.toFixed(2) || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, textAlign: 'right' }}>
        <Link 
          href={`https://finance.yahoo.com/quote/${financial_data.stock_info?.ticker}`} 
          target="_blank" 
          rel="noopener"
          underline="hover"
        >
          View more financial data →
        </Link>
      </Box>
    </Paper>
  );
}

export default FinancialOverview;
