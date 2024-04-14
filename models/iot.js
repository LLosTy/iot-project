import mongoose, {Schema} from "mongoose";

const iotSchema = new Schema({
    hardwareId: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userSurname: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
})
const Iot = mongoose.models.Iot || mongoose.model("Iot", iotSchema, 'iots')

export default Iot;