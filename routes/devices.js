const express = require('express')
const mongoose = require('mongoose');
const Device = require("../_models/device.js")
const router = express.Router()


//Get Devices under a UserId
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

//TODO check if userId exists and is valid
//Create new device
router.post('/', async (req, res) => {
    const { hardwareId, userId } = req.body;
    if(hardwareId && userId){
        try{
            const exists = await Device.find({
                hardwareId: req.body.hardwareId
            }).lean()
            if(Object.keys(exists).length !== 0){
                res.status(409).json({message: 'Device with this ID already exists'})
            }else{
                const result = await new Device({ hardwareId, userId }).save();
                res.json({message: result})
            }

        }catch (error){
            console.error('Error while creating device:',error);
            res.status(500).json({message: 'Internal Server Error'})
        }
    }else{
        return res.status(400).json({ error: "Please specify user ID  and hardware ID!" });
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