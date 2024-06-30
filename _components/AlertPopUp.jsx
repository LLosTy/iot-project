// AlertPopUp.jsx
"use client"
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@mui/material';
import axiosInstance from '../axiosInstance'; // Ensure correct import path
import { useSession } from 'next-auth/react';

const AlertPopUp = () => {
    const { data: session, status } = useSession();
    const userId = session?.user?.id; // Replace with actual session userId from context
    const isLoading = status === "loading";

    const [newNotification, setNewNotification] = useState(null);
    const [open, setOpen] = useState(false);
    const [shownNotification, setShownNotification] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!isLoading && userId && !shownNotification) {
                try {
                    const response = await axiosInstance.get('/area/getUserAreas', {
                        headers: {
                            Authorization: `Bearer ${session.user.token}`,
                        },
                        params: { userId },
                    });
                    const areas = response.data;

                    // Find the latest notification from all areas
                    areas.forEach(area => {
                        const recentNotification = area.notifications
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                        if (recentNotification && (!newNotification || new Date(recentNotification.timestamp) > new Date(newNotification.timestamp))) {
                            setNewNotification({ ...recentNotification, areaName: area.areaName });
                            setOpen(true);
                            setShownNotification(true);
                        }
                    });
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        fetchNotifications();

        // Poll for new notifications every 60 seconds
        const intervalId = setInterval(fetchNotifications, 300000);

        return () => clearInterval(intervalId);
    }, [userId, newNotification, isLoading, session, shownNotification]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {newNotification && (
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    sx={{ width: '25%' }}
                >
                    <Alert
                        onClose={handleClose}
                        severity="warning"
                        sx={{
                            width: '100%',
                            fontSize: '1.2rem',
                        }}
                    >
                        <strong>New Alert:</strong><br />
                        Area: {newNotification.areaName}<br/>
                        Temperature: {newNotification.value}°C<br />
                        Threshold Min: {newNotification.thresholdMin}°C<br />
                        Threshold Max: {newNotification.thresholdMax}°C
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};

AlertPopUp.propTypes = {
    session: PropTypes.object,
};

export default AlertPopUp;