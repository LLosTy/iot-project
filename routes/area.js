
const Area = require("../_models/area.js")
const express = require("express");
const router = express.Router()
const Device = require("../_models/device")
const User = require("../_models/users")

//TODO maybe create a validation middleware for users, devices etc ..

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
                //TODO check if userId owns hardwareId -- just add userId to device find

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
//TODO Delete an Area route based on Area ID

router.delete('/',async(req,res) => {
    try{
        const result = await Area.deleteOne({
            "_id":req.query.areaId,
            "ownerId":req.query.userId
        })
        res.status(200).json({message: result})
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Internal Server Error'})
    }
})


//TODO Get Areas based on userID

router.get('/', async(req,res) => {
    try{
        const userExists = await User.find({_id:req.query.userId})
        if(Object.keys(userExists).length === 0){
            res.status(409).json({message: 'This user ID does not exist'})
        }else{
            const areas = await Area.find({
                $or: [
                    { ownerId: req.query.userId },
                    { viewers: { $elemMatch: { viewerId: req.query.userId } } }
                ]
            });
            res.json({message: areas})
        }
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'})
    }
})

//TODO Update an Area name

router.put('/updateAreaName', async (req, res) =>{
    if(req.body.userId && req.body.areaName && req.body.areaId){
        try{
            const area = await Area.findOneAndUpdate({
                _id: req.body.areaId,
                ownerId: req.body.userId
            }, {areaName: req.body.areaName}, {new: true})
            //new: true makes sure to return the document after it was updated

            res.status(200).json({message: area})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Error while updating areaName'})
        }
    }else{
        res.status(409).json({message: 'Please include new Area Name and user Id'})
    }
})

//TODO Add hardwareID to area route

//TODO Remove hardwareID from area route

//TODO Add a viewer route

router.put('/addViewer', async(req,res) => {
    if(req.body.userId && req.body.areaId){
        try{
            const exists = await User.find({_id:req.body.userId})
            if(Object.keys(exists).length !== 0){
                const result = await Area.findOneAndUpdate(
                    {_id:req.body.areaId},
                    {$push: {"viewers":{"viewerId": req.body.userId}}},
                    {new:true}
                )
                res.status(200).json({message: result})
            }else{
                res.status(409).json({message: "Please specify a valid user ID"})
            }
        }catch(error){
            console.log(error)
            res.status(500).json({message: "An error occurred while adding user to viewers"})
        }
    }
})

//TODO Remove a viewer route

//TODO Set thresholdMin

//TODO Set thresholdMax

//TODO Set up websocket to fetch new data from temps based on hardwareID

//TODO Set up acknowledge logic

module.exports = router