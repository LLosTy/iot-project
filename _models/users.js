const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    githubId: {
        type: String,
    },
    googleId: {
        type: String,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default: "",
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
})
const Users = mongoose.models.Users || mongoose.model("Users", usersSchema, 'users')

module.exports = Users;