import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const defaultFormData = {
  month: months[new Date().getMonth()],
  year: currentYear,
  c1: '',
  c2: '',
  c3: '',
  c4: '',
  c5: '',
  c001: '',
  c002: '',
  c003: '',
  c004: '',
  c005: '',
  c006: '',
  c007: '',
  c008: '',
};

const ProductionDataForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    // Update form data when initialData changes
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Update Production Data' : 'Enter New Production Data'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Month"
              name="month"
              value={formData.month}
              onChange={handleChange}
            >
              {months.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Consumer Units C1-C5 */}
          {[1, 2, 3, 4, 5].map(num => (
            <Grid item xs={12} sm={6} md={4} key={`c${num}`}>
              <TextField
                fullWidth
                label={`C${num} Production (Units)`}
                name={`c${num}`}
                type="number"
                value={formData[`c${num}`]}
                onChange={handleChange}
              />
            </Grid>
          ))}

          {/* Consumer Units C001-C008 */}
          {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
            <Grid item xs={12} sm={6} md={4} key={`c00${num}`}>
              <TextField
                fullWidth
                label={`C00${num} Production (Units)`}
                name={`c00${num}`}
                type="number"
                value={formData[`c00${num}`]}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductionDataForm; 