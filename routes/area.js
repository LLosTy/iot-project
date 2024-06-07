
const Area = require("../_models/area.js")
const express = require("express");
const router = express.Router()
const Device = require("../_models/device")
const User = require("../_models/users")

router.get('/hello',async (req,res) =>{
    res.json({message:"hello area"})
})

//TODO Create an Area route
//TODO more error checking and optimization
//TODO check if ownerID is real and also viewerID's
router.put('/create',async(req,res) =>{
    console.log(req.body)
    const {areaName, hardwareId, ownerId, viewers, notifications} = req.body
    if(areaName && hardwareId && ownerId){
        try{
            //TODO lookup ownerId and iterate through viewers and also ownerId != viewerId
            const [areaExists, hardwareExists, userExists] = await Promise.all([
                Area.find({ hardwareId }).lean(),
                Device.find({ hardwareId }).lean(),
                User.find({_id:ownerId}).lean()
            ]);

            if(Object.keys(areaExists).length !== 0){
                res.status(409).json({message: 'Area with this hardware ID already exists'})
            }

            if(Object.keys(hardwareExists).length === 0){
                res.status(409).json({message: 'This hardware ID does not exist'})
            }

            if(Object.keys(userExists).length === 0){
                res.status(409).json({message: 'This user ID does not exist'})
            }

            else{
                if(Object.keys(hardwareExists).length !== 0){
                    const result = await new Area({areaName, hardwareId, ownerId, viewers, notifications}).save();
                    res.json({message: result})
                }
            }
        }catch(error){
            console.error('Error while creating area:',error);
            res.status(500).json({message: 'Internal Server Error'})
        }
    }else{
        return res.status(400).json({ error: "Please specify areaName, hardwareId and ownerId" });
    }
})
//TODO Delete an Area route

//TODO Get an Area based on userID

router.get('/', async(req,res) => {
    console.log(req.query.userId)
    const areas = await Area.find({
        $or: [
            { ownerId: req.query.userId },
            { viewers: { $elemMatch: { viewerId: req.query.userId } } }
        ]
    });

    res.json({message: areas})

})

//TODO Update an Area

//TODO Add hardwareID to area route

//TODO Remove hardwareID from area route

//TODO Add a viewer route

//TODO Remove a viewer route

//TODO Set thresholdMin

//TODO Set thresholdMax

//TODO Set up websocket to fetch new data from temps based on hardwareID

//TODO Set up acknowledge logic

module.exports = router