const mongoose = require("mongoose");

const viewerSchema = new mongoose.Schema({
    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    email: {
        type: String,
        required: false
    }
}, { _id: false }); 

const notificationSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        required: false
    },
    thresholdMin: {
        type: Number,
        required: false
    },
    thresholdMax: {
        type: Number,
        required: false
    },
    acknowledged: {
        type: Boolean,
        required: false,
        default: false
    }
}, { _id: false });

const areaSchema = new mongoose.Schema({
    areaName: {
        type: String,
        required: true
    },
    hardwareId: {
        type: String,
        required: false
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    viewers: [viewerSchema],
    thresholdMin: {
        type: Number,
        required: true,
        default: 15
    },
    thresholdMax: {
        type: Number,
        required: true,
        default: 30
    },
    notifications: [notificationSchema]
});

areaSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    const thresholdMin = update.$set ? update.$set.thresholdMin : update.thresholdMin;
    const thresholdMax = update.$set ? update.$set.thresholdMax : update.thresholdMax;

    if (thresholdMin !== undefined && thresholdMax !== undefined && thresholdMin > thresholdMax && thresholdMin < -40 || thresholdMax > 80) {
            next(new Error('Invalid threshold values'));
    } else {
        next();
    }
});

const Area = mongoose.models.Area || mongoose.model("Area",areaSchema,"area")

module.exports = Area