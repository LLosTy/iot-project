const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    payload: {
        client_id: {
            type: String,
            required: true,
        },
        temp: {
            type: String,
            required: true,
        },
    },
    qos: {
        type: Number,
        required: true,
    },
    retain: {
        type: Boolean,
        required: true,
    },
    _msgid: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
})
const Temperature = mongoose.models.Temperature || mongoose.model("Temperature", temperatureSchema, 'temperatures')

module.exports = Temperature;