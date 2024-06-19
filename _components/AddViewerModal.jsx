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
import axios from "axios";

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

const AddViewerModal= ({ open ,onClose, onAddViewer ,areaId}) => {

    // const [username, setUserName] = useState('');

    const handleAddViewer = async () => {
        try {
            console.log(areaId, email)
            const response = axios({
                method: 'put',
                baseURL: 'http://localhost:8080/area/addViewer',
                params: {
                    areaId:areaId,
                    userEmail:email,
                },
                responseType: 'json',
            }).then(response => {
                // handle success
                //TODO toast
                // console.log(response.data.newViewer);
                onAddViewer(response.data.newViewer);

            })
                .catch(error => {
                    //handle error
                    //TODO toast
                    console.error("Caught Error",error);
                });
            // const newViewer = response;
            // onAddViewer(newViewer);
        } catch (error) {
            console.error('Error adding viewer:', error);
        }
    };

    const [email, setEmail] = useState('');

    // Step 3: Handle input changes
    const handleChange = (event) => {
        setEmail(event.target.value);
    };


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
                        <TextField id="input-with-sx" variant="standard" fullWidth placeholder="user@email.com" value={email} onChange={handleChange}/>
                        <IconButton edge="end" aria-label="add-viewer" color="error" onClick={onClose} sx={{mt:1, mr:1}}>
                            <CloseIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="add-viewer" color="success" onClick={handleAddViewer} sx={{mt:1}}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}

export default AddViewerModal