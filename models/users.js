import mongoose, {Schema, mongo} from "mongoose";
import { type } from "os";

const usersSchema = new Schema({
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

export default Users;