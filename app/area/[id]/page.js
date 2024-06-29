"use client" // app/area/[id]/page.js

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from "react";
import Viewers from "/_components/Viewers";
import TempLineChart from '/_components/TempLineChart';
import { useSession } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Button,
  Box,
  TextField,
  Typography,
} from '@mui/material';
import AlertIcon from '@mui/icons-material/Warning';
import AlertsDrawer from '../../../_components/AlertsDrawer';
import ThresholdModal from '../../../_components/ThresholdModal';
import { GetArea } from '../../../_lib/actions/areas'; 
import { GetTempsByDevice } from '../../../_lib/actions/temps'; 
import axiosInstance from '../../../axiosInstance';


const AreaPage = () => {
    const [area, setArea] = useState([])
    const [temps, setTemps] = useState([])
    const [dateFrom, setDateFrom] = useState(dayjs());
    const [dateTo, setDateTo] = useState(dayjs());
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [thresholdModalOpen, setThresholdModalOpen] = useState(false);

    const params = useParams()
    const { data:session, status} = useSession()
    const { id } = params
    const isLoading = status === "loading"
    const isOwner = session?.user?.id === area?.ownerId;

    useEffect(() => {
// <<<<<<< TempsByInterval
//         if (id && area.length === 0) {
//             console.log(id)
//             axiosInstance.get('/area/getArea', {
//                 params: {
//                     areaId: id,
//                 },
//             })
//                 .then(response => {
//                     // Handle success
//                     console.log(response.data);
//                     setArea(response.data);
//                 })
//                 .catch(error => {
//                     // Handle error
//                     console.error('Caught Error', error);
//                 });
//         }
//         if (area.hardwareId) {
//             // GetTempsByDevice(area.hardwareId).then((temps) => {setTemps(temps)})
//             // console.log("Setting temps")
//             // axiosInstance.get(`/temps?device=${area.hardwareId}`).then(
//             //     response => {setTemps(response.data.temps)}
//             // )
//             // setTemps(rawTemps)
// =======

      if (id && area.length === 0 && session && !isLoading) {
        console.log(id);
        axiosInstance.get('/area/getArea', {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
          params: {
            areaId: id,
          },
        })
          .then(response => {
            console.log(response.data);
            setArea(response.data);
          })
          .catch(error => {
            console.error('Caught Error', error);
          });
      }
    }, [session, id, area]);

    const getTemps = async () => {
      if (area && area.hardwareId && session && !isLoading) {
        try {
          const rawTemps = await GetTempsByDevice(session, area.hardwareId);
          setTemps(rawTemps);
        } catch (error) {
          console.error('Failed to fetch temperatures', error);
        }
      }
    };
  
    useEffect(() => {
      getTemps();
    }, [area, session, isLoading]);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
      };

      if (!area) {
        return <div>Loading...</div>;
      }

    return (
        <div>
            <h1>{area.areaName}</h1>
            {/*<TempLineChart rawTemperatures={temps} deviceId={area.hardwareId} />*/}
            <TempLineChart deviceId={area.hardwareId} />

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleDrawer(true)}
                    startIcon={<AlertIcon />}
                    style={{ marginBottom: '16px' }}
                >
                    Alerts Drawer
                </Button>
                <Box
                    sx={{
                    width: '200px',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    textAlign: 'center'
                    }}
                >
                    <Typography variant="h6">
                    Max Threshold: {area.thresholdMax}°C
                    </Typography>
                </Box>
                <Box
                    sx={{
                    width: '200px',
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    textAlign: 'center',
                    marginBottom: '16px'
                    }}
                >
                    <Typography variant="h6">
                    Min Threshold: {area.thresholdMin}°C
                    </Typography>
                </Box>
                {isOwner ?
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setThresholdModalOpen(true)}
                  style={{ marginBottom: '16px' }}
                >
                  Change Thresholds
                </Button>
              : <Button
              variant="contained"
              color="primary"
              onClick={() => setThresholdModalOpen(true)}
              style={{ marginBottom: '16px' }}
            >
              Change Thresholds
            </Button>}

                <AlertsDrawer
                    area={area}
                    drawerOpen={drawerOpen}
                    toggleDrawer={toggleDrawer}
                    session={session}
                    setArea={setArea}
                />
                </div>
            </div>


            <Viewers viewers={area.viewers} areaId={id} />

            <Button variant="contained" color="primary" onClick={getTemps}>
                Get Temps
            </Button>

            <ThresholdModal
                area={area}
                session={session}
                open={thresholdModalOpen}
                onClose={() => setThresholdModalOpen(false)}
                setArea={setArea}
            />
        </div>
    )
}

export default AreaPage