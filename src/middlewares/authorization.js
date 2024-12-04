const { verifyToken } = require('../utils/jwt');

exports.authorize = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Token is required' });
        }
        token = token.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded.error) {
            return res.status(401).json({ error: 'Unauthorized', message: decoded.error });
        }
        if (req.battery.macAddress !== decoded.macAddress || req.battery.serialNumber !== decoded.serialNumber) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};