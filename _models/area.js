const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
    areaName:{
      type: String,
      required: true,
    },
    hardwareId:{
        type: String,
        required: false,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    viewers:{
        viewerId:{
            type: mongoose.Schema.Types.ObjectId,
            required: false
        }
    },
    notifications:{
        notification:{
            timestamp:{
                type: Date,
                default: new Date()
            },
            value:{
                type:Number,
                required: true,
            },
            threshold:{
                type:Number,
                required:true,
            },
            acknowledged:{
                type:Boolean,
                required:true,
                default:false
            }
        }
    }

})

const Area = mongoose.models.Area || mongoose.model("Area",areaSchema,"area")

module.exports = Area