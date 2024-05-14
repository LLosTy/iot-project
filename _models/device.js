const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    hardwareId: {
        type: Number,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    timestamp: {
        type: Date,
        default: new Date()
    }
})
const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema, 'devices')

module.exports = Device;