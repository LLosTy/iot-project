const express = require('express')
const router = express.Router()


router.get('/',async(req,res) =>{
    try{
        res.json("hello uwu")
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

module.exports = router