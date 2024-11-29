const crypto = require('crypto');

const { ulid } = require('ulid');


exports.generateSerialNumber = (macAddress) => {
    const fullULID = ulid();
    const hash = crypto.createHash('sha256').update(macAddress).digest('hex');
    const serialNumber = `${fullULID.slice(0, 10)}${hash.slice(0, 6)}`.toUpperCase();
    return serialNumber;
};