'use client'

import DeviceCard from '/components/DeviceCard'
import AddDeviceCard from '/components/AddDeviceCard'
import {Add} from "@mui/icons-material";
import {Grid} from "@mui/material";
export default function DevicePage(){
    return(
        <div>
            <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                    <DeviceCard/>
                    <AddDeviceCard/>
                </Grid>
            </Grid>
        </div>
        // <h1>Device page</h1>

    )
}