import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function GeographicPresence({ companyData }) {
  const { geographic_presence, contact_info } = companyData;
  
  // Default coordinates if none provided
  const defaultPosition = [37.7749, -122.4194]; // San Francisco
  
  // Use headquarters coordinates if available, otherwise default
  const position = geographic_presence?.headquarters_location?.latitude && 
                  geographic_presence?.headquarters_location?.longitude
    ? [geographic_presence.headquarters_location.latitude, geographic_presence.headquarters_location.longitude]
    : defaultPosition;
  
  // Get regions and countries
  const regions = geographic_presence?.regions || [];
  const countries = geographic_presence?.countries || [];
  
  // If no geographic data is available
  if ((!regions || regions.length === 0) && 
      (!countries || countries.length === 0) && 
      !contact_info?.headquarters?.city) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Geographic Presence
      </Typography>
      
      {/* Map */}
      <Box sx={{ height: 300, width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer 
          center={position} 
          zoom={4} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {contact_info?.headquarters?.city && contact_info?.headquarters?.country 
                ? `${contact_info.headquarters.city}, ${contact_info.headquarters.country}`
                : 'Headquarters'}
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
      
      {/* Regions */}
      {regions.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PublicIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              Operating Regions
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {regions.map((region, index) => (
              <Chip key={index} label={region} variant="outlined" size="small" />
            ))}
          </Stack>
        </Box>
      )}
      
      {/* Countries */}
      {countries.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FlagIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              Countries
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {countries.map((country, index) => (
              <Chip key={index} label={country} variant="outlined" size="small" />
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );
}

export default GeographicPresence;
