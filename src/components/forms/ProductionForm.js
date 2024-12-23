import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext.js';
import { production, getSites } from '../../services/api.js';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Typography, 
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faSun } from '@fortawesome/free-solid-svg-icons';

const ProductionForm = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    month_year: dayjs(),
    plantType: 'wind', // 'wind' or 'solar'
    timeSlots: {
      wind: {
        c1: '', // 06:00-10:00
        c2: '', // 10:00-14:00
        c3: '', // 14:00-18:00
        c4: '', // 18:00-22:00
        c5: ''  // 22:00-06:00
      },
      solar: {
        morning: '',   // 06:00-12:00
        afternoon: '', // 12:00-17:00
        evening: ''    // 17:00-19:00
      }
    },
    site_id: '',
    site_name: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableSites, setAvailableSites] = useState([]);

  // Time slot definitions
  const timeSlots = {
    wind: [
      { id: 'c1', label: 'C1 (06:00-10:00)', type: 'peak' },
      { id: 'c2', label: 'C2 (10:00-14:00)', type: 'non-peak' },
      { id: 'c3', label: 'C3 (14:00-18:00)', type: 'peak' },
      { id: 'c4', label: 'C4 (18:00-22:00)', type: 'peak' },
      { id: 'c5', label: 'C5 (22:00-06:00)', type: 'non-peak' }
    ],
    solar: [
      { id: 'morning', label: 'Morning (06:00-12:00)', type: 'peak' },
      { id: 'afternoon', label: 'Afternoon (12:00-17:00)', type: 'peak' },
      { id: 'evening', label: 'Evening (17:00-19:00)', type: 'non-peak' }
    ]
  };

  // Load available sites
  useEffect(() => {
    const loadSites = async () => {
      try {
        const response = await getSites(user.username);
        if (response.success) {
          setAvailableSites(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({
              ...prev,
              site_id: response.data[0].id,
              site_name: response.data[0].name
            }));
          }
        }
      } catch (error) {
        console.error('Error loading sites:', error);
        setError('Failed to load sites');
      }
    };

    if (user?.username) {
      loadSites();
    }
  }, [user]);

  const handlePlantTypeChange = (event, newType) => {
    if (newType !== null) {
      setFormData(prev => ({
        ...prev,
        plantType: newType
      }));
    }
  };

  const handleTimeSlotChange = (slotId, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [prev.plantType]: {
          ...prev.timeSlots[prev.plantType],
          [slotId]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productionData = {
        month_year: formData.month_year.format('YYYY-MM'),
        site_id: formData.site_id,
        site_name: formData.site_name,
        plant_type: formData.plantType,
        time_slots: formData.timeSlots[formData.plantType]
      };

      const response = await production.submitData(productionData);
      
      if (response.success) {
        setSuccess('Production data submitted successfully');
        // Reset form data except site and plant type
        setFormData(prev => ({
          ...prev,
          timeSlots: {
            ...prev.timeSlots,
            [prev.plantType]: Object.keys(prev.timeSlots[prev.plantType]).reduce((acc, key) => {
              acc[key] = '';
              return acc;
            }, {})
          }
        }));
      } else {
        setError(response.message || 'Failed to submit production data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Production Data Entry
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <ToggleButtonGroup
              value={formData.plantType}
              exclusive
              onChange={handlePlantTypeChange}
              aria-label="plant type"
              fullWidth
            >
              <ToggleButton value="wind" aria-label="wind power">
                <FontAwesomeIcon icon={faWind} style={{ marginRight: '8px' }} />
                Wind Power
              </ToggleButton>
              <ToggleButton value="solar" aria-label="solar power">
                <FontAwesomeIcon icon={faSun} style={{ marginRight: '8px' }} />
                Solar Power
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Month and Year"
              value={formData.month_year}
              onChange={(newValue) => setFormData(prev => ({ ...prev, month_year: newValue }))}
              views={['year', 'month']}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Site</InputLabel>
              <Select
                value={formData.site_id}
                onChange={(e) => {
                  const site = availableSites.find(s => s.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    site_id: e.target.value,
                    site_name: site?.name || ''
                  }));
                }}
                label="Site"
              >
                {availableSites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              {formData.plantType === 'wind' ? 'Wind Power Time Slots' : 'Solar Power Time Slots'}
            </Typography>
          </Grid>

          {timeSlots[formData.plantType].map((slot) => (
            <Grid item xs={12} md={4} key={slot.id}>
              <TextField
                fullWidth
                label={slot.label}
                type="number"
                value={formData.timeSlots[formData.plantType][slot.id]}
                onChange={(e) => handleTimeSlotChange(slot.id, e.target.value)}
                InputProps={{
                  endAdornment: <Typography variant="caption">MW</Typography>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Submitting...' : 'Submit Production Data'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductionForm;
