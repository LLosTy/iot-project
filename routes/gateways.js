const express = require('express')
const Gateway = require("../_models/gateway.js")
const Temperature = require('../_models/temperature.js')
const router = express.Router()
const { generateGatewayToken } = require("../_lib/hash.js")
const authMiddleware = require("../authMiddleware.js")


/*TODO: Add new Gateway to the DB
    Generate Gateway token for comms after adding - Generating from some params 
*/
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

//TODO: Remove Gateway after its removed from physical location
router.delete('/remove', authMiddleware, async (req, res) => {
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

//TODO: Get comms token after verification If account exists, else error of non-existnant acc
router.post('/get-comms-token', async (req, res) => {
    const { login_name, login_pwd } = req.body;

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

//TODO: Update Gateway
router.patch('/update', authMiddleware, async (req, res) => {
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

//TODO: Write new temperatures after Gateway verification and updating gateways last_received_comms
router.post('/add-temperatures', authMiddleware, async (req, res) => {
    const { hardwareId, temperatures } = req.body;

    if (!hardwareId || !temperatures || !Array.isArray(temperatures)) {
        return res.status(400).json({ error: "Please specify the hardwareId and an array of temperatures!" });
    }

    try {
        // Find the gateway by hardwareId
        const gateway = await Gateway.findOne({ hardwareIds: hardwareId });
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        // Verify the hardwareId is part of the gateway's hardwareIds
        if (!gateway.hardwareIds.includes(hardwareId)) {
            return res.status(403).json({ message: 'Hardware ID not associated with this gateway' });
        }

        // Update the last_received_comms field
        gateway.last_received_comms.push(new Date());
        await gateway.save();

        // Add new temperature records
        const temperatureRecords = temperatures.map(temp => ({
            ...temp,
            hardwareId, // Ensure hardwareId is included in each temperature record
            timestamp: new Date(temp.timestamp) // Ensure the timestamp is properly formatted
        }));

        const result = await Temperature.insertMany(temperatureRecords);

        // Respond with the created temperature records
        res.json({ message: 'Temperatures added successfully', temperatures: result });

    } catch (error) {
        console.error('Error while adding temperatures:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;