import mongoose, {Schema} from "mongoose";

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
        type: mongoose.Schema.ObjectId,
        required: true
    },
    timeestamp: {
        type: Date,
        required: true
    }
})
const Device = mongoose.models.Device || mongoose.model("Device", deviceSchema, 'devices')

export default Device;