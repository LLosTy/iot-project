// components/AlertsDrawer.jsx

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  Drawer
} from '@mui/material';
import { format } from 'date-fns';
import { AcknowledgeArea } from '../_lib/actions/areas'; // Import the AcknowledgeArea function

const AlertsDrawer = ({ area, drawerOpen, toggleDrawer, session, setArea }) => {
  const handleAcknowledge = async () => {
    const updatedNotification = {
      ...area.notifications.notification,
      acknowledged: !area.notifications.notification.acknowledged,
    };

    try {
      const acknowledgeData = {
        areaId: area._id,
        userId: session.user.id,
        acknowledged: updatedNotification.acknowledged,
      };

      await AcknowledgeArea(session, acknowledgeData);

      setArea({
        ...area,
        notifications: {
          notification: updatedNotification,
        },
      });
    } catch (error) {
      console.error('Failed to update notification', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Typography variant="h6" sx={{ my: 2, mx: 2 }}>
          Alerts
        </Typography>
        <Divider />
        <Box sx={{ p: 2 }}>
          {area.notifications && area.notifications.notification ? (
            <Box sx={{ mb: 2 }}>
              <Typography>
                {`Timestamp: ${format(new Date(area.notifications.notification.timestamp), 'yyyy-MM-dd HH:mm:ss')}`}
              </Typography>
              <Typography>
                {`Acknowledged: ${area.notifications.notification.acknowledged ? 'Yes' : 'No'}`}
              </Typography>
              <Button
                variant="contained"
                color={area.notifications.notification.acknowledged ? "secondary" : "primary"}
                onClick={handleAcknowledge}
              >
                {area.notifications.notification.acknowledged ? "Unacknowledge" : "Acknowledge"}
              </Button>
            </Box>
          ) : (
            <Typography>No alerts</Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default AlertsDrawer;
