const express = require('express')
const Gateway = require("../../../_models/gateway.js")
const Temperature = require('../../../_models/temperature.js')
const Area = require('../../../_models/area.js')
const router = express.Router()
const { generateGatewayToken } = require("../../../_lib/hash.js")
const {verifyGatewayToken, basicGatewayAuthMiddleware} = require("../../../authMiddleware.js")


//TODO: FOR ALL -> What if HardwareID doesn't exist anymore
router.put('/create', async (req, res) => {
    const { hardwareId, alias, login_name, login_pwd } = req.body;

    if (login_name && login_pwd) {
        try {
            // Check if a gateway with the same login_name already exists
            const exists = await Gateway.findOne({ login_name }).lean();
            if (exists) {
                return res.status(409).json({ message: 'Gateway with this login name already exists' });
            }

            // Create a new gateway entry
            const newGateway = new Gateway({
                hardwareId,
                alias,
                login_name,
                login_pwd
            });

            // Save the new gateway
            const result = await newGateway.save();

            // Generate a token for the gateway
            const token = generateGatewayToken(result.last_login, result.login_name);

            // Respond with the created gateway and token
            res.json({ message: 'Gateway created successfully', gateway: result, token });

        } catch (error) {
            console.error('Error while creating gateway:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(400).json({ error: "Please specify login name and password!" });
    }
});

router.delete('/remove', verifyGatewayToken, async (req, res) => {
    const { _id, login_name } = req.body;

    if (_id || login_name) {
        try {
            // Find the gateway by _id or login_name
            const query = _id ? { _id } : { login_name };
            const exists = await Gateway.findOne(query);
            if (!exists) {
                return res.status(404).json({ message: 'Gateway not found' });
            }

            // Remove the gateway
            await Gateway.deleteOne(query);

            // Respond with a success message
            res.json({ message: 'Gateway removed successfully' });

        } catch (error) {
            console.error('Error while removing gateway:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(400).json({ error: "Please specify either _id or login name!" });
    }
});

router.post('/get-comms-token', basicGatewayAuthMiddleware, async (req, res) => {
    const { login_name, login_pwd } = req;

    if (login_name && login_pwd) {
        try {
            // Check if the gateway exists
            const gateway = await Gateway.findOne({ login_name, login_pwd });
            if (!gateway) {
                return res.status(404).json({ message: 'Account does not exist' });
            }

            // Update the last_login field
            gateway.last_login = new Date();
            await gateway.save();

            // Generate the comms token
            const token = generateGatewayToken(gateway.last_login, gateway.login_name);

            // Respond with the token
            res.json({ message: 'Token generated successfully', token, gatewayId: gateway._id });

        } catch (error) {
            console.error('Error while generating comms token:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(400).json({ error: "Please specify login name and password!" });
    }
});

router.patch('/update', verifyGatewayToken, async (req, res) => {
    const { _id, hardwareIds, alias } = req.body;

    if (!_id) {
        return res.status(400).json({ error: "Please specify the gateway _id!" });
    }

    try {
        // Find the gateway by _id
        const gateway = await Gateway.findById(_id);
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        // Update hardwareIds if provided
        if (hardwareIds) {
            if (!Array.isArray(hardwareIds)) {
                return res.status(400).json({ error: "Devices should be an array!" });
            }
            gateway.hardwareIds = [...new Set([...gateway.hardwareIds, ...hardwareIds])]; // Ensure no duplicates
        }

        // Update alias if provided
        if (alias !== undefined) {
            if (alias === null) {
                gateway.alias = undefined; // Remove alias
            } else if (typeof alias === 'string') {
                gateway.alias = alias; // Add or rename alias
            } else {
                return res.status(400).json({ error: "Alias should be a string or null!" });
            }
        }

        // Save the updated gateway
        const result = await gateway.save();

        // Respond with the updated gateway
        res.json({ message: 'Gateway updated successfully', gateway: result });

    } catch (error) {
        console.error('Error while updating gateway:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/add-temperatures', verifyGatewayToken, async (req, res) => {
    const { _id, hardwareIds, temperatures } = req.body;
    console.log(req.body)

    if (!hardwareIds || !Array.isArray(hardwareIds) || !temperatures || typeof temperatures !== 'object') {
        return res.status(400).json({ error: "Please specify an array of hardwareIds and a valid temperatures object!" });
    }

    try {
        // Find the gateway by _id
        const gateway = await Gateway.findOne({ _id });
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        // Verify the hardwareIds are part of the gateway's hardwareIds
        const invalidIds = hardwareIds.filter(id => !gateway.hardwareIds.includes(id));
        if (invalidIds.length > 0) {
            return res.status(403).json({ message: `Hardware IDs not associated with this gateway: ${invalidIds.join(', ')}` });
        }

        // Update the last_received_comms field
        gateway.last_received_comms.push(new Date());

        // Create a map to store the sum of temperatures and count for each client_id
        const averageTemperatureRecords = [];
        for (const client_id in temperatures) {
            const { sum, count } = temperatures[client_id];
            const averageTemp = (sum / count).toFixed(2);

            averageTemperatureRecords.push({
                payload: {
                    client_id: client_id,
                    temp: averageTemp
                },
                timestamp: new Date() // You can use a different timestamp if needed
            });

            // Add client_id to hardwareIds if not already present
            if (!gateway.hardwareIds.includes(client_id)) {
                gateway.hardwareIds.push(client_id);
            }

            // Find the area associated with the hardware ID
            const area = await Area.findOne({ hardwareId: client_id });
            if (area) {
                // Check if the average temperature exceeds the threshold
                console.log("AREA:::", area)
                if (averageTemp < area.thresholdMin || averageTemp > area.thresholdMax) {
                    // Check for notifications within the last 4 hours
                    const recentNotification = area.notifications.sort((a, b) => b.timestamp - a.timestamp)[0];
                    const now = new Date();
                    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
                    console.log("AREA SEARCH:::", area.notifications.find(notification => new Date(notification.timestamp) >= fourHoursAgo))
                    console.log("RECENT NOTIF:::", recentNotification)

                    if (!recentNotification || recentNotification.acknowledged || new Date(recentNotification.timestamp) < fourHoursAgo) {
                        // Add a new notification
                        console.log("AREA NOTIFICATION PUSH:::")

                        area.notifications.push({
                            timestamp: now,
                            value: averageTemp,
                            thresholdMin: area.thresholdMin,
                            thresholdMax: area.thresholdMax,
                            acknowledged: false
                        });
                        await area.save();
                    }
                }
            }
        }

        await gateway.save();
        const result = await Temperature.insertMany(averageTemperatureRecords);

        // Respond with the created average temperature records
        res.json({
            message: 'Average temperatures added successfully',
            temperatures: result
        });

    } catch (error) {
        console.error('Error while adding temperatures:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get("/test", verifyGatewayToken, async(req, res) => {
    res.json({message: "You sure verified yourself"})
})

module.exports = router;