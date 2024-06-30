import * as React from 'react';
import { Box, Button, Card, TextField, Typography, Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CreateDevice } from '../_lib/actions/devices';
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

const AddDeviceCard = ({ refreshDevices }) => {
    const { data: session } = useSession();
    const [open, setOpen] = React.useState(false);
    const [hardwareId, setHardwareId] = React.useState('');
    const [alias, setAlias] = React.useState('');
    const [error, setError] = React.useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (hardwareId.length !== 16) {
            setError('Hardware ID must be 16 characters long!\n Current length: '+ hardwareId.length);
            return;
        }
        const device = {
            hardwareId,
            alias,
            userId: session.user.id,
        };
        try {
            await CreateDevice(session, device);
            handleClose();
            refreshDevices();
        } catch (error) {
            console.error("Error creating device:", error);
        }
    };

    return (
        <Card sx={{ height: 230, width: 345 }}>
            <Button
                variant="contained"
                color="success"
                sx={{ width: '100%', height: '100%' }}
                onClick={handleOpen}
            >
                <AddIcon sx={{ width: '25%', height: '25%' }} />
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Device
                    </Typography>
                    <TextField
                        label="Hardware ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={hardwareId}
                        onChange={(e) => setHardwareId(e.target.value)}
                    />
                    <TextField
                        label="Alias"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
    );
};

export default AddDeviceCard;
