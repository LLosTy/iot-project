// components/ThresholdModal.jsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button
} from '@mui/material';
import { SetThreshold } from '../_lib/actions/areas'; // Import the SetThreshold function

const ThresholdModal = ({ area, session, open, onClose, setArea }) => {
  const [thresholdMax, setThresholdMax] = useState(area.thresholdMax);
  const [thresholdMin, setThresholdMin] = useState(area.thresholdMin);

  const handleThresholdChange = async () => {
    try {
      const thresholdData = {
        areaId: area._id,
        thresholdMax,
        thresholdMin,
      };
      await SetThreshold(session, thresholdData);

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
        <TextField
          autoFocus
          margin="dense"
          label="Max Threshold"
          type="number"
          fullWidth
          variant="standard"
          value={thresholdMax}
          onChange={(e) => setThresholdMax(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Min Threshold"
          type="number"
          fullWidth
          variant="standard"
          value={thresholdMin}
          onChange={(e) => setThresholdMin(e.target.value)}
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
