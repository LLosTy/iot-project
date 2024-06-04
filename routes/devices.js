const express = require('express')
const mongoose = require('mongoose');
const Device = require("../_models/device.js")
const router = express.Router()


// GET request handler for device ID
//TODO change DeviceId to search for HardwareId, write the endpoint without needing "query" variable
router.get('/', async (req, res) => {
    if(req.query.userId){
        try {
            const devices = await Device.find({"userId": req.query.userId}).lean() // Retrieve all devices
            res.json(devices) // Send devices as JSON response
        } catch (error) {
            console.error('Error retrieving devices:', error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    }else{
        return res.status(400).json({ error: "Please specify user ID in query params!" });
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
    if(req.query.hardwareId){
        try{
            const result = await Device.deleteOne({"hardwareId":req.query.hardwareId})
            if(result.deletedCount === 0){
                return res.status(404).json({message: 'Device not found'});
            }
            res.json({message:'Deleted device with hardwareId: ' + req.query.hardwareId})

        }catch(error){
            console.error('Error while deleting device:',error);
            res.status(500).json({message: 'Internal Server Error'})
        }
    }else{
        return res.status(400).json({ error: "Please specify hardware ID in query params!" });
    }

});

module.exports = router