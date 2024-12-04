const mongoose = require('mongoose');

const batterySchema = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
        unique: true
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    ping: {
        lastPing: {
            type: Date
        },
        logs: [{
            type: Date
        }]
    },
    configurations: {
        type: Object
    },
}, {
    timestamps: true
});

const Battery = mongoose.model('Battery', batterySchema);

module.exports = Battery;