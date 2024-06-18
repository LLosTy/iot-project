import {Divider, Grid, IconButton, List, ListItem, ListItemText} from "@mui/material";

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';import {useEffect, useState} from "react";
import axios from "axios";
import mongoose from "mongoose";

import AddViewerModal from '/_components/AddViewerModal'
const style = {
    py: 0,
    width: '100%',
    borderRadius: 2,
    border: '0',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};
const Viewers = ({viewers :initialViewers , areaId}) => {
    const [viewers, setViewers] = useState(initialViewers);

    useEffect(() => {
        setViewers(initialViewers);
    }, [initialViewers]);

    console.log(areaId)

    const handleDelete = (viewer, areaId) => {
        console.log("areaId: ", areaId, "viewer: ", viewer, "viewerId: ",viewer.viewerId)
        axios({
            method: 'put',
            baseURL: 'http://localhost:8080/area/removeViewer',
            params: {
                areaId:areaId,
                userId:viewer.viewerId
            },
            responseType: 'json',
        })
            .then(response => {
                // handle success
                //TODO toast
                console.log(response.data);
                setViewers(viewers.filter(viewer => viewer.viewerId !== viewer.viewerId));
            })
            .catch(error => {
                //handle error
                //TODO toast
                console.error("Caught Error",error);
            });
        //TODO axios Delete call to BE
    };

    const handleAdd = () => {

        let viewerId = new mongoose.Types.ObjectId("666b49cbd0dc6c1730457df4")
        let areaId = new mongoose.Types.ObjectId("666add362adf262f9d478c83");

        let viewer = [
            viewerId,
            areaId
        ]

        axios({
            method: 'put',
            baseURL: 'http://localhost:8080/area/addViewer',
            params: {
                userId:viewerId,
                areaId:areaId
            },
            responseType: 'json',
        })
            .then(response => {
                // handle success
                //TODO toast
                setViewers(viewers.push(viewer));
            })
            .catch(error => {
                //handle error
                //TODO toast
                console.error("Caught Error",error);
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
                        <IconButton edge="end" aria-label="delete" color="success" onClick={() => handleAdd()}>
                            <PersonAddAlt1Icon />
                        </IconButton>
                    }
                >
                </ListItem>
                    <AddViewerModal></AddViewerModal>
                </List>
            </Grid>
        );
    } else {
        console.error("Expected viewers to be an array, but got:", viewers);
        return null;
    }
};


export default Viewers