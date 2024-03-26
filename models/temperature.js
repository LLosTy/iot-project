import mongoose, {Schema} from "mongoose";

const temperatureSchema = new Schema({
    _id: Schema.Types.ObjectId,
    topic: String,
    payload: Number,
    qos: Number,
    retain: Boolean,
    _msgid: String,
    timestamp: Date,
    hardwareId: Number
})
const Temperature = mongoose.models.Temperature || mongoose.model("Temperature", temperatureSchema, 'temperatures')
// const Temperature = mongoose.model('Temperature', temperatureSchema, 'temperatures');

// temperatureSchema = mongoose.model('Temperature', temperatureSchema);
// module.exports = mongoose.model('Temperature',temperatureSchema)
// module.exports = temperatureSchema;
export default Temperature;