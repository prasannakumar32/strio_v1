import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';

const ProductionDataForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    month: '',
    c1: '',
    c2: '',
    c3: '',
    c4: '',
    c5: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        month: initialData.month,
        c1: initialData.c1,
        c2: initialData.c2,
        c3: initialData.c3,
        c4: initialData.c4,
        c5: initialData.c5
      });
    } else {
      setFormData({
        month: '',
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? '' : Math.round(parseFloat(value)) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Production Data' : 'Enter New Production Data'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Month"
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {['c1', 'c2', 'c3', 'c4', 'c5'].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  label={field.toUpperCase()}
                  type="number"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductionDataForm;
