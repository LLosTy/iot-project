const express = require('express')
const Device = require("../_models/device.js")
const router = express.Router()
const { verifyToken } = require("../authMiddleware.js")


//Get Devices under a UserId
router.get('/', verifyToken, async (req, res) => {
    if (req.query.userId) {
        try {
            const devices = await Device.find({ "userId": req.query.userId }).lean(); // Retrieve all devices
            res.json(devices); // Send devices as JSON response
        } catch (error) {
            console.error('Error retrieving devices:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        return res.status(400).json({ error: "Please specify user ID in query params!" });
    }
});

//TODO check if user on userId exists and is valid
router.put('/create', verifyToken, async (req, res) => {
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

router.put('/update', verifyToken, async (req, res) => {
    //Had to validate length here, otherwise it would throw a different error if i validated in mongoose
    if (req.body.hardwareId.length === 16) {
        try {
            let device = await Device.findOne({
                hardwareId: req.body.hardwareId
            })

            const fieldsToUpdate = ['userId', 'alias'];

            fieldsToUpdate.forEach(field => {
                if (req.body[field]) {
                    device[field] = req.body[field];
                }
            });

            await device.save()

            res.json(device)

        } catch (error) {
            console.error('Error while updating device:', error);
            res.status(500).json({message: 'Internal Server Error'})
        }
    } else {
        res.status(400).json({message: 'Please specify a valid hardwareId'})
    }
});

router.delete('/', verifyToken, async (req, res) => {
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