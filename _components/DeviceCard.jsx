import * as React from 'react';
import { Card, Typography, IconButton, Box } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UpdateDevice, DeleteDevice } from '../_lib/actions/devices';
import { useSession } from 'next-auth/react';
import UpdateDeviceModal from './UpdateDeviceModal';
import DeleteDeviceModal from './DeleteDeviceModal';


const DeviceCard = ({ device, refreshDevices }) => {
    const { data: session } = useSession();
    const [updateOpen, setUpdateOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [alias, setAlias] = React.useState(device.alias);

    const handleUpdateOpen = () => setUpdateOpen(true);
    const handleUpdateClose = () => setUpdateOpen(false);
    const handleDeleteOpen = () => setDeleteOpen(true);
    const handleDeleteClose = () => setDeleteOpen(false);

    const handleUpdateSubmit = async () => {
        const updatedDevice = { ...device, alias };
        try {
            await UpdateDeviceModal(session, updatedDevice);
            handleUpdateClose();
            refreshDevices();
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await DeleteDevice(session, device._id);
            handleDeleteClose();
            refreshDevices();
        } catch (error) {
            console.error("Error deleting device:", error);
        }
    };

    return (
        <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 2 }}>
            <Box>
                <Typography gutterBottom variant="h6" component="div">
                    Device ID: {device.hardwareId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Owner: {session.user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Room: {device.alias}
                </Typography>
            </Box>
            <Box>
                <IconButton onClick={handleUpdateOpen}>
                    <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={handleDeleteOpen}>
                    <DeleteIcon color="error" />
                </IconButton>
            </Box>
            
            {/* Update Modal */}
            <UpdateDeviceModal 
                open={updateOpen} 
                handleClose={handleUpdateClose} 
                alias={alias} 
                setAlias={setAlias} 
                handleUpdateSubmit={handleUpdateSubmit} 
            />

            {/* Delete Confirmation Modal */}
            <DeleteDeviceModal 
                open={deleteOpen} 
                handleClose={handleDeleteClose} 
                handleDeleteConfirm={handleDeleteConfirm} 
            />
        </Card>
    );
};

export default DeviceCard;
