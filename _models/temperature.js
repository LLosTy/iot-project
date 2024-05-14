const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
    topic: String,
    payload: {
        type: Object,
        required: true
    },
    qos: Number,
    retain: Boolean,
    _msgid: String,
    timestamp: {
        type: Date,
        required: true
    },
    hardwareId: {
        type: Number,
        required: true
    }
})
const Temperature = mongoose.models.Temperature || mongoose.model("Temperature", temperatureSchema, 'temperatures')

module.exports = Temperature;