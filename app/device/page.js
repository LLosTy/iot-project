'use client'

import DeviceCard from '/_components/DeviceCard'
import AddDeviceCard from '/_components/AddDeviceCard'
import {Add} from "@mui/icons-material";
import {Grid} from "@mui/material";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GetUserDevices } from '../../_lib/actions/devices'
//TODO fetch data based on the currently signed in user

export default function DevicePage(){
    const {data: session} = useSession();
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            if (session) {
                try {
                    const userDevices = await GetUserDevices(session.user.id);
                    setDevices(userDevices);
                    console.log("User Devices:", userDevices);
                } catch (error) {
                    console.error("Error fetching user devices:", error);
                }
            }
        };

        fetchDevices();
    }, [session])

    console.log(devices)

    return(
        <div>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <DeviceCard DeviceId={1234}
                                    Owner={"Marco"}
                                    Room={"Master Bedroom"}
                                    LatestTemp={25}
                        />
                        {(devices.length > 0) ? (
                            console.log(devices),
                            devices.map((device) => {
                                <DeviceCard
                                    key={device._id}
                                    DeviceId={device.hardwareId}
                                    Owner={session.user.name}
                                    Room={device.alias}
                                    LatestTemp={25}
                                />
                            })
                        )
                        : null}
                        <AddDeviceCard/>
                    </Grid>
                </Grid>
        </div>
        // <h1>Device page</h1>

    )
}