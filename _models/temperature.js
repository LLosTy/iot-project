const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
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
    timestamp: {
        type: Date,
        required: true,
    },
})
const Temperature = mongoose.models.Temperature || mongoose.model("Temperature", temperatureSchema, 'temperatures')

module.exports = Temperature;