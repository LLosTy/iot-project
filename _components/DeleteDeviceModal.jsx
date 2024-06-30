// components/DeviceDeleteModal.jsx

import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { DeleteDevice } from '../_lib/actions/devices';
import { useSession } from 'next-auth/react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DeleteDeviceModal = ({ open, handleClose, hardwareId, refreshDevices }) => {
  const { data: session } = useSession();

  const handleDelete = async () => {
    try {
      await DeleteDevice(session, hardwareId);
      handleClose();
      refreshDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="delete-modal-title" variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography id="delete-modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete this device?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">Delete</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteDeviceModal;
