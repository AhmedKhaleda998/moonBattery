const Battery = require('../models/battery');

const { generateSerialNumber } = require('../utils/serial');
const { generateToken } = require('../utils/jwt');

const { errorHandler } = require('../utils/error');

exports.register = async (req, res) => {
    try {
        const { macAddress } = req.body;
        let generationTrails = 0;
        let serialNumber = generateSerialNumber(macAddress);
        while (await Battery.findOne({ serialNumber })) {
            serialNumber = generateSerialNumber(macAddress);
            generationTrails += 1;
            if (generationTrails > 3) {
                return res.status(400).json({ message: 'Error generating serial number', error: 'Too many tries' });
            }
        }
        const battery = new Battery({ macAddress, serialNumber });
        const savedBattery = await battery.save();
        const payload = { serialNumber: savedBattery.serialNumber, macAddress: savedBattery.macAddress };
        const token = generateToken(payload);
        res.status(201).json({ message: 'Battery registered successfully', token, serialNumber: savedBattery.serialNumber });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

exports.ping = async (req, res) => {
    try {
        let battery = req.battery;
        const now = new Date();
        battery.ping.lastPing = now;
        battery.ping.logs.push(now);
        await battery.save();
        res.status(200).json({ message: 'Battery pinged successfully' });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

exports.configure = async (req, res) => {
    try {
        const { configurations } = req.body;
        let battery = req.battery;
        battery.configurations = { ...battery.configurations, ...configurations };
        await battery.save();
        res.status(200).json({ message: 'Battery configured successfully' });
    } catch (error) {
        errorHandler(error, req, res);
    }
};