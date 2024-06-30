// components/AlertsDrawer.jsx
"use client"
import React, {useState, useEffect} from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  Drawer
} from '@mui/material';
import { format } from 'date-fns';
import axiosInstance from '../axiosInstance'; // Ensure correct import path
import { useSession } from 'next-auth/react';


const AlertsDrawer = ({ drawerOpen, toggleDrawer }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isLoading = status === "loading";

  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!isLoading && userId) {
        try {
          const response = await axiosInstance.get('/area/getUserAreas', {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
            params: { userId },
          });
          setAreas(response.data);
        } catch (error) {
          console.error('Error fetching areas:', error);
        }
      }
    };

    fetchAreas();
  }, [userId, isLoading, session]);

  const handleAcknowledge = async (areaIndex, notificationIndex, acknowledged) => {
    const updatedAreas = [...areas];
    updatedAreas[areaIndex].notifications[notificationIndex].acknowledged = acknowledged;

    try {
      await axiosInstance.put('/area/acknowledge', {
        areaId: updatedAreas[areaIndex]._id,
        notificationIndex: notificationIndex,
        acknowledged: acknowledged,
      }, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });

      setAreas(updatedAreas);
    } catch (error) {
      console.error('Failed to update notification', error);
    }
  };
  // Uncomment this line to limit the display to the last 10 notifications
  // const displayedNotifications = area.notifications.slice(-10).reverse();

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ width: 350 }}
        role="presentation"
      >
        <Typography variant="h6" sx={{ my: 2, mx: 2 }}>
          Alerts
        </Typography>
        <Divider />
        <Box sx={{ p: 2, maxHeight: '80vh', overflowY: 'auto' }}>
          {areas.length > 0 ? (
            areas.map((area, areaIndex) => (
              <Box key={area._id} sx={{ mb: 2 }}>
                {area.notifications.map((notification, notificationIndex) => (
                  <Box key={notificationIndex} sx={{ mb: 2 }}>
                    <Typography variant="h6">
                      {area.areaName}
                    </Typography>
                    <Typography>
                      {`Timestamp: ${format(new Date(notification.timestamp), 'yyyy-MM-dd HH:mm:ss')}`}
                    </Typography>
                    <Typography>
                      {`Temperature: ${notification.value}°C`}
                    </Typography>
                    <Typography>
                      {`Threshold Min: ${notification.thresholdMin}°C`}
                    </Typography>
                    <Typography>
                      {`Threshold Max: ${notification.thresholdMax}°C`}
                    </Typography>
                    <Typography>
                      {`Acknowledged: ${notification.acknowledged ? 'Yes' : 'No'}`}
                    </Typography>
                    <Button
                      variant="contained"
                      color={notification.acknowledged ? "secondary" : "primary"}
                      onClick={() => handleAcknowledge(areaIndex, notificationIndex, !notification.acknowledged)}
                      sx={{
                        mt: 1,
                        backgroundColor: notification.acknowledged ? '#d32f2f' : '#1976d2', // Matching primary and secondary colors
                        '&:hover': {
                          backgroundColor: notification.acknowledged ? '#c62828' : '#1565c0', // Matching hover colors
                        },
                      }}
                    >
                      {notification.acknowledged ? "Unacknowledge" : "Acknowledge"}
                    </Button>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <Typography>No alerts</Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default AlertsDrawer;
