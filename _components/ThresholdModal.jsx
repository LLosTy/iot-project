import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Typography
} from '@mui/material';
import axiosInstance from '../axiosInstance'; // Ensure correct import path

const ThresholdModal = ({ area, session, open, onClose, setArea }) => {
  const [thresholdMax, setThresholdMax] = useState(area.thresholdMax);
  const [thresholdMin, setThresholdMin] = useState(area.thresholdMin);
  const [error, setError] = useState('');

  useEffect(() => {
    setThresholdMax(area.thresholdMax);
    setThresholdMin(area.thresholdMin);
  }, [area]);

  const handleThresholdChange = async () => {
    if (thresholdMin >= thresholdMax) {
      setError('Invalid threshold!!');
      return;
    }

    try {
      const thresholdData = {
        areaId: area._id,
        userId: session.user.id,
        newMax: thresholdMax,
        newMin: thresholdMin,
      };
      await axiosInstance.put('/area/setThreshold', thresholdData, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      setArea({
        ...area,
        thresholdMax,
        thresholdMin,
      });
      onClose();
    } catch (error) {
      console.error('Failed to set threshold', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Thresholds</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the new threshold values.
        </DialogContentText>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          autoFocus
          margin="dense"
          label="Max Threshold"
          type="number"
          fullWidth
          variant="standard"
          value={thresholdMax}
          onChange={(e) => setThresholdMax(Number(e.target.value))}
        />
        <TextField
          margin="dense"
          label="Min Threshold"
          type="number"
          fullWidth
          variant="standard"
          value={thresholdMin}
          onChange={(e) => setThresholdMin(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleThresholdChange}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThresholdModal;
