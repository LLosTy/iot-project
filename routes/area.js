const Area = require("../_models/area.js")
const express = require("express");
const router = express.Router()
const Device = require("../_models/device")
const User = require("../_models/users")
const cors = require("cors");
const { verifyToken } = require("../authMiddleware.js")


router.use(cors({
    origin: 'http://localhost:3000'
}));


//TODO maybe create a validation middleware for users, devices etc ..

router.get('/hello',async (req,res) =>{
    res.json({message:"hello area"})
})

//TODO Create an Area route
//TODO more error checking and optimization
//TODO check if ownerID is real and also viewerID's
router.put('/create', verifyToken, async(req,res) =>{
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

router.delete('/', verifyToken, async(req,res) => {
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

router.get('/getArea', verifyToken, async(req,res) => {
    if(req.query.areaId){
        try{
            const result = await Area.findOne({"_id": req.query.areaId})
            res.status(200).json(result)
        }catch(error){
            res.status(500).json({message: 'Internal Server Error'})
        }
    }else{
        res.status(409).json({message: 'Please specify areaId'})
    }
})


//TODO Get Areas based on userID

router.get('/getUserAreas', verifyToken, async(req,res) => {
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
            res.json(areas)
        }
    }catch(error){
        res.status(500).json({message: 'Internal Server Error'})
    }
})

//TODO Update an Area name

router.put('/updateAreaName', verifyToken, async (req, res) =>{
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

//OPTIMIZE addViewer and removeViewer are basically the same, one just has push the other pull
//figure out how to make it one endpoint instead of two, maybe send it in query params like push / pull
//But if you do that, you NEED to validate the sent query params cause you dont want an outsider to delete the whole thing or something

router.put('/addViewer', verifyToken, async(req,res) => {
    if(req.query.userEmail && req.query.areaId){
        try{
            //TODO validate if the user adding a viewer is an owner
            const exists = await User.findOne({email:req.query.userEmail})
            if(Object.keys(exists).length !== 0){
                const result = await Area.findOneAndUpdate(
                    {_id:req.query.areaId},
                    {$push: {"viewers":{"viewerId": exists._id  ,"email" :exists.email}}},
                    {new:true}
                )
                if(result === null){
                    res.status(409).json({message: "Please specify a valid area ID"})
                }else{
                    const newViewer = {
                        email:exists.email,
                        viewerId: exists._id
                    }
                    res.status(200).json({message: result, newViewer: newViewer})
                }
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
router.put('/removeViewer', verifyToken, async(req,res) => {
    if(req.query.userId && req.query.areaId){
        try{
            //TODO validate if the user removing a viewer is an owner
            const exists = await User.findOne({_id:req.query.userId})
            if(Object.keys(exists).length !== 0){
                const result = await Area.findOneAndUpdate(
                    {_id:req.query.areaId},
                    {$pull: {"viewers":{"viewerId": req.query.userId,"email" :exists.email}}},
                    {new:true}
                )
                // console.log("Result of delete: ",result, "email:", exists.email)
                if(result === null){
                    res.status(409).json({message: "Please specify a valid area ID"})
                }else{
                    res.status(200).json({message: result})
                }
            }else{
                res.status(409).json({message: "Please specify a valid user ID"})
            }
        }catch(error){
            console.log(error)
            res.status(500).json({message: "An error occurred while adding user to viewers"})
        }
    }
})

router.put('/setThreshold', verifyToken, async(req,res) => {
    if (req.body.areaId && req.body.userId && req.body.newMin){
        try{
            const area = await Area.findOneAndUpdate({
                _id: req.body.areaId,
                ownerId: req.body.userId,
            }, { thresholdMin: req.body.newMin, thresholdMax: req.body.newMax }, {new:true, runValidators: true })

            if(area){
                res.status(200).json({message: area})
            }else{
                res.status(409).json({message: "Could not find area"})
            }
        }catch(error){
            console.log(error.message)
            res.status(500).json({message:"Internal server error: " + error.message})
        }
    }else{
        res.status(409).json({message: "Please specify areaId, userId and newMin"})
    }
})


//TODO Set up websocket to fetch new data from temps based on hardwareID

//TODO Set up acknowledge logic

module.exports = router