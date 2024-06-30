'use client'

import DeviceCard from '/_components/DeviceCard';
import AddDeviceCard from '/_components/AddDeviceCard';
import { Grid, Container } from "@mui/material";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GetUserDevices } from '/_lib/actions/devices';

export default function DevicePage() {
    const { data: session, status } = useSession();
    const [devices, setDevices] = useState([]);
    const isLoading = status === "loading";

    const fetchDevices = async () => {
        if (!isLoading && session) {
            try {
                const userDevices = await GetUserDevices(session, session.user.id);
                setDevices(userDevices);
                console.log("User Devices:", userDevices);
            } catch (error) {
                console.error("Error fetching user devices:", error);
            }
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [session, isLoading]);

    return (
        <Container>
            <Grid container spacing={2}>
                {Array.isArray(devices) && devices.length > 0 && devices.map((device) => (
                    <Grid item xs={12} key={device._id}>
                        <DeviceCard
                            device={device}
                            refreshDevices={fetchDevices}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <AddDeviceCard refreshDevices={fetchDevices} />
                </Grid>
            </Grid>
        </Container>
    );
}
