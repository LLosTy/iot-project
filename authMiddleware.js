const crypto = require('crypto');
require('dotenv').config();
const Gateway = require('./models/Gateway'); // Adjust the path as necessary

// Helper function to generate the expected token
const generateExpectedToken = (lastLogin, loginName) => {
    const loginEncode = process.env.LOGIN_ENCODE;
    if (!loginEncode) {
        throw new Error('LOGIN_ENCODE environment variable is not defined');
    }

    // Prepare the data to be hashed
    const data = `${lastLogin.toISOString()}${loginName}${loginEncode}`;

    // Create SHA-256 hash
    const hash = crypto.createHash('sha256').update(data).digest('hex');

    return hash;
};

// Middleware to check token
const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    const { _id } = req.body;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    if (!_id) {
        return res.status(400).json({ message: 'Gateway ID missing' });
    }

    try {
        // Find the gateway by _id
        const gateway = await Gateway.findById(_id);
        if (!gateway) {
            return res.status(404).json({ message: 'Gateway not found' });
        }

        // Generate the expected token
        const expectedToken = generateExpectedToken(gateway.last_login, gateway.login_name);

        // Compare tokens
        if (authorization !== expectedToken) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Token is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
