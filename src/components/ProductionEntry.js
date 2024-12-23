import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const ProductionEntry = ({ site, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    timeSlot: '',
    powerValue: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate power value
    if (!formData.powerValue) {
      newErrors.powerValue = 'Power value is required';
    } else {
      const powerNum = parseFloat(formData.powerValue);
      if (isNaN(powerNum)) {
        newErrors.powerValue = 'Must be a valid number';
      } else if (powerNum < 0) {
        newErrors.powerValue = 'Power value cannot be negative';
      } else if (powerNum > site.capacity) {
        newErrors.powerValue = `Cannot exceed site capacity of ${site.capacity} units`;
      }
    }

    // Validate time slot
    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Time slot is required';
    }

    // Validate dates
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        siteId: site.id,
        powerValue: parseFloat(formData.powerValue)
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/production');
      }, 1500);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to submit production data'
      }));
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">
        Production Entry for {site.name}
      </h2>

      {errors.submit && (
        <div className="alert alert-error">
          <FontAwesomeIcon icon={faExclamationTriangle} className="icon" />
          {errors.submit}
        </div>
      )}

      {submitSuccess && (
        <div className="alert alert-success">
          <FontAwesomeIcon icon={faCheck} className="icon" />
          Production data submitted successfully!
        </div>
      )}

      <form>
        <div className="grid">
          <div className="field">
            <label htmlFor="powerValue" className="label">Power Value (units)</label>
            <input
              type="number"
              id="powerValue"
              value={formData.powerValue}
              onChange={handleInputChange}
              name="powerValue"
              className={`input ${errors.powerValue ? 'input-error' : ''}`}
              required
            />
            {errors.powerValue && (
              <span className="error-message">{errors.powerValue}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="timeSlot" className="label">Time Slot</label>
            <select
              id="timeSlot"
              value={formData.timeSlot}
              onChange={handleInputChange}
              name="timeSlot"
              className={`input ${errors.timeSlot ? 'input-error' : ''}`}
              required
            >
              <option value="">Select Time Slot</option>
              <option value="C1">C1 (00:00 - 04:00)</option>
              <option value="C2">C2 (04:00 - 08:00)</option>
              <option value="C3">C3 (08:00 - 12:00)</option>
              <option value="C4">C4 (12:00 - 16:00)</option>
              <option value="C5">C5 (16:00 - 20:00)</option>
              <option value="C6">C6 (20:00 - 24:00)</option>
            </select>
            {errors.timeSlot && (
              <span className="error-message">{errors.timeSlot}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="startDate" className="label">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              name="startDate"
              className={`input ${errors.startDate ? 'input-error' : ''}`}
              required
            />
            {errors.startDate && (
              <span className="error-message">{errors.startDate}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="endDate" className="label">End Date</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              name="endDate"
              className={`input ${errors.endDate ? 'input-error' : ''}`}
              required
            />
            {errors.endDate && (
              <span className="error-message">{errors.endDate}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="notes" className="label">Notes (Optional)</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleInputChange}
              name="notes"
              className="input"
              rows="3"
            />
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            onClick={handleSubmit}
            className="custom-button custom-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="icon icon-white" />
                <span>Submit Production Data</span>
              </>
            )}
          </button>
        </div>
      </form>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        className="custom-dialog"
      >
        <DialogTitle className="custom-dialog-title">
          Confirm Production Entry
        </DialogTitle>
        <DialogContent className="custom-dialog-content">
          <p>Please review the following details:</p>
          <div className="confirmation-details">
            <p><strong>Site:</strong> {site.name}</p>
            <p><strong>Power Value:</strong> {formData.powerValue} units</p>
            <p><strong>Time Slot:</strong> {formData.timeSlot}</p>
            <p><strong>Start Date:</strong> {formData.startDate}</p>
            <p><strong>End Date:</strong> {formData.endDate}</p>
            {formData.notes && (
              <p><strong>Notes:</strong> {formData.notes}</p>
            )}
          </div>
        </DialogContent>
        <DialogActions className="custom-dialog-actions">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="custom-button custom-button-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSubmit}
            className="custom-button custom-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                <span>Submitting...</span>
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductionEntry;
