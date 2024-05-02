'use client'

import DeviceCard from '/_components/DeviceCard'
import AddDeviceCard from '/_components/AddDeviceCard'
import {Add} from "@mui/icons-material";
import {Grid} from "@mui/material";
import { SessionProvider, useSession } from 'next-auth/react';
//TODO fetch data based on the currently signed in user

export default function DevicePage(){
    const {data: session} = useSession();
    console.log(session)
    
    if (session){
        console.log(session)
    }

    return(
        <div>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={8}>
                        <DeviceCard DeviceId={1234}
                                    Owner={"Marco"}
                                    Room={"Master Bedroom"}
                                    LatestTemp={25}
                        />
                        <AddDeviceCard/>
                    </Grid>
                </Grid>
        </div>
        // <h1>Device page</h1>

    )
}