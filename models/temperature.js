import mongoose, {Schema} from "mongoose";

const temperatureSchema = new Schema({
    topic: String,
    payload: {
        type: Number,
        require: true
    },
    qos: Number,
    retain: Boolean,
    _msgid: String,
    timestamp: {
        type: Date,
        require: true
    },
    hardwareId: {
        type: Number,
        require: true
    }
})
const Temperature = mongoose.models.Temperature || mongoose.model("Temperature", temperatureSchema, 'temperatures')
// const Temperature = mongoose.model('Temperature', temperatureSchema, 'temperatures');

// temperatureSchema = mongoose.model('Temperature', temperatureSchema);
// module.exports = mongoose.model('Temperature',temperatureSchema)
// module.exports = temperatureSchema;
export default Temperature;