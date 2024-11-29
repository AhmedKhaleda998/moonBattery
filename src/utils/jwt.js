const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        return jwt.sign(payload, secretKey);
    } catch (error) {
        console.log(error);
        return;
    }
};

exports.verifyToken = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        return jwt.verify(token, secretKey);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return { error: 'Token expired' };
        } else if (error instanceof jwt.JsonWebTokenError) {
            return { error: 'Invalid token. Token has been manipulated' };
        } else {
            return { error: 'Internal server error' };
        }
    }
};