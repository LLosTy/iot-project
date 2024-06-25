import {Divider, Grid, IconButton, List, ListItem, ListItemText} from "@mui/material";

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {useEffect, useState} from "react";
import axios from "axios";
import mongoose from "mongoose";

import AddViewerModal from '/_components/AddViewerModal'
import axiosInstance from "/_lib/axiosInstance";
const style = {
    py: 0,
    width: '100%',
    borderRadius: 2,
    border: '0',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};



const Viewers = ({viewers :initialViewers , areaId}) => {


    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const addViewer = (newViewer) => {
        setViewers([...viewers, newViewer]);
        closeModal(); // Optionally close the modal after adding the viewer
    };

    const [viewers, setViewers] = useState(initialViewers);

    useEffect(() => {
        setViewers(initialViewers);
    }, [initialViewers]);

    // console.log(areaId)

    const handleDelete = (viewer, areaId) => {
        console.log("!!!areaId: ", areaId, "viewer: ", viewer, "viewerId: ",viewer.viewerId,"VIEWERS:", viewers)
        axiosInstance.put('/area/removeViewer', {}, {
            params: {
                userId: viewer.viewerId,
                areaId: areaId,
            },
        })
            .then(response => {
                // Handle success
                // TODO: toast
                console.log(response.data);
                setViewers(viewers.filter(viewer => viewer.viewerId !== viewer.viewerId));
            })
            .catch(error => {
                // Handle error
                // TODO: toast
                console.error('Caught Error', error);
            });
        //TODO axios Delete call to BE
    };

    if (Array.isArray(viewers)) {
        return (
            <Grid item xs={12} md={6}>
                <List sx={style}>


                    {/*<Divider component="li" />*/}
                    { viewers.length === 0?

                        <ListItem>
                            <ListItemText primary="This area has no viewers"/>
                        </ListItem>

                        :

                        <ListItem>
                            <ListItemText primary="Viewers"/>
                        </ListItem>
                    }

                    {viewers.length !== 0?

                        viewers.map((viewer) => (
                        <>

                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" color="error" aria-label="delete" onClick={() => handleDelete(viewer, areaId)}>
                                        <PersonRemoveIcon/>
                                    </IconButton>
                                }
                                key={viewer.viewerId}
                            >
                                {viewer.email}
                            </ListItem>
                            {/*<Divider variant="middle" component="li"/>*/}
                            <IconButton color="secondary" aria-label="Add a viewer">
                            </IconButton>
                        </>
                    )) : <div></div>}
                <ListItem
                    secondaryAction={
                        <IconButton edge="end" aria-label="add-viewer" color="success" onClick={openModal}>
                            <PersonAddAlt1Icon />
                        </IconButton>
                    }
                >
                </ListItem>
                </List>
                <AddViewerModal open={isModalOpen} onClose={closeModal}  areaId={areaId} onAddViewer={addViewer}/>
            </Grid>
        );
    } else {
        console.error("Expected viewers to be an array, but got:", viewers);
        return null;
    }
};


export default Viewers