
const Area = require("../_models/area.js")
const express = require("express");
const router = express.Router()

router.get('/hello',async (req,res) =>{
    res.json({message:"hello area"})
})

//TODO Create an Area route
router.put('/create',async(req,res) =>{
    console.log(req.body)
    const {areaName, hardwareId, ownerId, viewers, notifications} = req.body
    if(areaName && hardwareId && ownerId){
        try{
            const exists = await Area.find({
                hardwareId
            }).lean()

            if(Object.keys(exists).length !== 0){
                res.status(409).json({message: 'Area with this ID already exists'})
            }else{
                const result = await new Area({areaName, hardwareId, ownerId, viewers, notifications}).save();
                res.json({message: result})
            }
        }catch(error){
            console.error('Error while creating area:',error);
            res.status(500).json({message: 'Internal Server Error'})
        }
    }
})
//TODO Delete an Area route

//TODO Get an Area based on userID

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