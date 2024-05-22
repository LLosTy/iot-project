const express = require('express')
const mongoose = require('mongoose');
const Device = require("../_models/device.js")
const router = express.Router()


// GET request handler for device ID
router.get('/', async (req, res) => {
    try {
        const deviceId = req.query.device;
        const userId = req.query.user;
        let query = {};

        if (!deviceId && !userId) {
            return res.status(400).json({ error: "Please specify device ID or user ID!" });
        }

        if (deviceId) {
            query._id = deviceId;
        }
        if (userId) {
            query.userId = userId;
        }

        const devices = await Device.find(query)
            .limit(deviceId || userId ? undefined : 20)
            .populate("userId")
            .lean();

        console.log("User Devices:", devices);
        res.status(200).json({ devices });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// POST request handler
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        console.log("Device data:", data);
        const temp_data = Array(data)
        console.log("Device length: ", temp_data.length)


        if (!Array.isArray(data) && temp_data.length > 1) {
            return res.status(400).json({ error: "Data format is invalid, please provide JSON Array data for two or more devices!" });
        } else if (temp_data.length === 0) {
            return res.status(400).json({ error: "No devices data provided!" });
        }

        const devices = await Device.insertMany(data);

        if (!devices || devices.length === 0) {
            return res.status(500).json({ error: "Failed to create devices!" });
        }

        res.json({ message: "Successfully created devices", devices });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// PUT request handler
router.put('/', async (req, res) => {
    try {
        const data = req.body;
        const { _id, ...updateData } = data;

        if (!_id) {
            return res.status(400).json({ error: "Device ID wasn't specified!" });
        }

        const isValidObjectId = mongoose.isValidObjectId(_id);
        if (!isValidObjectId) {
            return res.status(400).json({ error: "Invalid Device ID format!" });
        }

        const updatedDevice = await Device.findByIdAndUpdate(_id, updateData, {
            new: true,
            runValidators: true,
        }).populate("userId").lean();

        if (!updatedDevice) {
            return res.status(404).json({ error: "Device not found!" });
        }

        res.status(200).json({ message:`Successfully updated device`, updatedDevice });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE request handler
router.delete('/', async (req, res) => {
    try {
        const deviceId = req.query.device;

        if (!deviceId) {
            return res.status(400).json({ message: "Device ID wasn't specified!" });
        }

        const isValidObjectId = mongoose.isValidObjectId(deviceId);
        if (!isValidObjectId) {
            return res.status(400).json({ message: "Invalid Device ID format!" });
        }

        const deletedDevice = await Device.findByIdAndDelete(deviceId);

        if (!deletedDevice) {
            return res.status(404).json({ message: "Device not found!" });
        }

        res.status(200).json({ message: "Successfully deleted IoT Device" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router