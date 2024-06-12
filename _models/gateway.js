const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema({
    hardwareId: {
        type: Array,
        required: false,
    },
    alias: {
        type: String,
        required: false
    },
    login_name: {
        type: String,
        required: true
    },
    login_pwd: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: new Date()
    }
})
const Gateway = mongoose.models.Gateway || mongoose.model("Gateway", gatewaySchema, 'gateways')

module.exports = Gateway;