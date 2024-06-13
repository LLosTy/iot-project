"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useSession} from "next-auth/react";

export default function MyAreasPage(){
    const {data: session} = useSession();
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (session) {
            console.log(session.user.id)
            axios({
                method: 'get',
                baseURL: 'http://localhost:8080/area/',
                params: {
                    userId: session.user.id
                },
                responseType: 'json',
            })
                .then(response => {
                    // handle success
                    console.log(response.data.message[0]);
                    setAreas(response.data.message);
                    setLoading(false);
                })
                .catch(error => {
                    // handle error
                    console.error(error);
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
        <div>
            {areas.length > 0 ? (
                <ul>
                    {areas.map((area) => (
                        <li key={area._id}>
                            <div>Area Name: {area.areaName}</div>
                            <div>Hardware ID: {area.hardwareId}</div>
                            <div>Owner ID: {area.ownerId}</div>
                            {/*<div>Viewers: {area.viewers.join(', ')}</div>*/}
                            <div>Threshold Min: {area.thresholdMin}</div>
                            <div>Threshold Max: {area.thresholdMax}</div>
                            {/*<div>Notifications: {area.notifications.join(', ')}</div>*/}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>No areas found</div>
            )}
        </div>
    );
};

