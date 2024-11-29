const { validationResult } = require('express-validator');

const Battery = require('../models/battery');

const { generateSerialNumber } = require('../utils/serial');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
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
        res.status(201).json({ message: 'Battery registered successfully', serialNumber: savedBattery.serialNumber });
    } catch (error) {
        res.status(400).json({ message: 'Error registering battery', error: error.message });
    }
};

exports.ping = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    try {
        let battery = req.battery;
        const now = new Date();
        battery.ping.lastPing = now;
        battery.ping.logs.push(now);
        await battery.save();
        res.status(200).json({ message: 'Battery pinged successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error pinging battery', error: error.message });
    }
};

exports.configure = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    try {
        const { configurations } = req.body;
        let battery = req.battery;
        battery.configurations = { ...battery.configurations, ...configurations };
        await battery.save();
        res.status(200).json({ message: 'Battery configured successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error configuring battery', error: error.message });
    }
};