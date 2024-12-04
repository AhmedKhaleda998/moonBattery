const { body } = require('express-validator');

const Battery = require('../models/battery');

exports.validateMacAddress = () => {
    return [
        body('macAddress')
            .notEmpty()
            .withMessage('MAC address is required')
            .isString()
            .withMessage('MAC address must be a string')
            .isLength({ min: 17, max: 17 })
            .withMessage('MAC address must be a string with 17 characters')
            .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
            .withMessage('MAC address must be in the format XX:XX:XX:XX:XX:XX and contain only hexadecimal characters')
    ]
};

exports.validateConfigurations = () => {
    return [
        body('configurations')
            .notEmpty()
            .withMessage('Configurations are required')
            .isObject()
            .withMessage('Configurations must be an object')
            .custom((configurations) => {
                const keys = Object.keys(configurations);
                if (keys.length < 1) {
                    return Promise.reject('Configurations must at least have 1 key-value pairs');
                }
                return true;
            })
    ]
};

exports.existingBattery = (exists) => {
    return [
        body('macAddress')
            .custom(async (macAddress, { req }) => {
                const existingBattery = await Battery.findOne({ macAddress });
                if (exists) {
                    if (!existingBattery) {
                        return Promise.reject('Battery not found');
                    }
                    req.battery = existingBattery;
                } else {
                    if (existingBattery) {
                        return Promise.reject('A battery with this MAC address already exists');
                    }
                }
            })
    ]
};