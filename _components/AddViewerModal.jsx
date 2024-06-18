import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {IconButton, TextField} from "@mui/material";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '0 solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px'

};

const AddViewerModal= ({ open ,onClose, onAddViewer }) => {

    const [username, setUserName] = useState('');


    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                       Add viewer
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' , mt:2}}>
                        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField id="input-with-sx" variant="standard" fullWidth placeholder="user@email.com" />
                        <IconButton edge="end" aria-label="add-viewer" color="error" onClick={onClose} sx={{mt:1, mr:1}}>
                            <CloseIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="add-viewer" color="success" onClick={onClose} sx={{mt:1}}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default AddViewerModal