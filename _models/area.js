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
    viewers:[
        {
            type: Array,
            viewerId:{
                type: mongoose.Schema.Types.ObjectId,
                required: false
            }
        }
    ],
    thresholdMin:{
        type: Number,
        required: true,
        default: 15
    },
    thresholdMax:{
        type: Number,
        required: true,
        default: 30
    },
    notifications:{
        notification:{
            timestamp:{
                type: Date,
                default: new Date()
            },
            value:{
                type:Number,
                required: false,
            },
            thresholdMin:{
                type:Number,
                required:false,
            },
            thresholdMax:{
                type:Number,
                required:false,
            },
            acknowledged:{
                type:Boolean,
                required:false,
                default:false
            }
        }
    }

})

const Area = mongoose.models.Area || mongoose.model("Area",areaSchema,"area")

module.exports = Area