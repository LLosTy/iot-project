const express = require('express')
const Gateway = require("../_models/gateway.js")
const router = express.Router()

/*TODO: Add new Gateway to the DB
    Generate Gateway token for comms after adding - Generating from some params 
*/
//TODO: Remove Gateway after its removed from physical location
//TODO: Get comms token after verification If account exists, else error of non-existnant acc
//TODO: Update Gateway -> Add new Devices to it, add/rename Gateway alias
//TODO: Update Gateway -> Remove Devices from it, remove Gateway alias
