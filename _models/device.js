import mongoose, {Schema} from "mongoose";
import Users from "./users";

const deviceSchema = new Schema({
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
    timeestamp: {
        type: Date,
        default: new Date()
    }
})
const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema, 'devices')

export default Device;