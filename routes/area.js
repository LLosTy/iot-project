
const Area = require("../_models/area.js")
const express = require("express");
const router = express.Router()

router.get('/hello',async (req,res) =>{
    res.json({message:"hello area"})
})



module.exports = router