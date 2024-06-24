"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useSession} from "next-auth/react";
import AreaItem from '/_components/AreaItem'
import {Box, Container, Grid} from "@mui/material";
import AddArea  from '/_components/AddAdrea'
import axiosInstance from "/_lib/axiosInstance";


export default function MyAreasPage(){
    const {data: session} = useSession();
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(loading)
        if (session && loading === true) {
            console.log(areas)
            axiosInstance.get('/area/getUserAreas', {
                params: {
                    userId: session.user.id,
                },
                responseType:"json",
            })
                .then(response => {
                    // Handle success
                    console.log(response.data[0]);
                    setAreas(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    // Handle error
                    console.error('Caught Error', error);
                    setError(error);
                    setLoading(false);
                });
        }
    });

    const handleSetAreas = (areas) => {
        setAreas(areas);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    return (
        <Container
            component="main"
            style={{ flex: 1 }}
            sx={{
                mt: 8,
                mb: 2,
            }}
        >

            {areas.length > 0 ? (
                <Box>
                    {areas.map((area) => (
                            <AreaItem key={area._id} id={area._id}
                                      areaName={area.areaName}
                                      hardwareId={area.hardwareId}
                                      ownerId={area.ownerId}
                                      thresholdMin={area.thresholdMin}
                                      thresholdMax={area.thresholdMax}
                            ></AreaItem>
                    ))}
                </Box>
            ) : (
                <div>No areas found</div>
            )}
            <AddArea></AddArea>
</Container>
    );
};

