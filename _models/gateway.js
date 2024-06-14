const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema({
    hardwareIds: {
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
    created_at: {
        type: Date,
        default: new Date()
    },
    last_login: {
        type: Date,
        default: new Date(),
        required: true
    },
    last_received_comms: {
        type: Array,
        required: false
    },
})
const Gateway = mongoose.models.Gateway || mongoose.model("Gateway", gatewaySchema, 'gateways')

module.exports = Gateway;