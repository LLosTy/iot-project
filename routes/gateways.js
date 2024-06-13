const express = require('express')
const Gateway = require("../_models/gateway.js")
const router = express.Router()
const { generateGatewayToken } = require("../_lib/hash.js")
const authMiddleware = require("../middleware.js")


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

            // Generate the comms token
            const token = generateGatewayToken(gateway.last_login, gateway.login_name);

            // Respond with the token
            res.json({ message: 'Token generated successfully', token });

        } catch (error) {
            console.error('Error while generating comms token:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(400).json({ error: "Please specify login name and password!" });
    }
});

//TODO: Update Gateway -> Add new Devices to it, add/rename Gateway alias
//TODO: Update Gateway -> Remove Devices from it, remove Gateway alias
router.patch('/update', authMiddleware, async (req, res) => {
    const { _id, addDevices, removeDevices, alias } = req.body;

    if (!_id) {
        return res.status(400).json({ error: "Please specify the gateway _id!" });
    }

    try {
        // Find the gateway by _id
        const gateway = await Gateway.findById(_id);
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        // Update devices
        if (addDevices && Array.isArray(addDevices)) {
            gateway.hardwareId = [...new Set([...gateway.hardwareId, ...addDevices])]; // Ensure no duplicates
        }
        if (removeDevices && Array.isArray(removeDevices)) {
            gateway.hardwareId = gateway.hardwareId.filter(id => !removeDevices.includes(id));
        }

        // Update alias
        if (alias === null) {
            gateway.alias = undefined; // Remove alias
        } else if (alias) {
            gateway.alias = alias; // Add or rename alias
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

module.exports = router;