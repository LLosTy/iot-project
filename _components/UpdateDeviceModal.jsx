import * as React from 'react';
import { Box, Typography, Modal, Button, TextField } from "@mui/material";

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

const UpdateDeviceModal = ({ open, handleClose, alias, setAlias, handleUpdateSubmit }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2">Update Device</Typography>
                <TextField
                    label="Alias"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained" color="primary">Submit</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UpdateDeviceModal;
