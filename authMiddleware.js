const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });
const basicAuth = require('basic-auth');
const Gateway = require("./_models/gateway");
const { generateGatewayToken } = require("./_lib/hash");
const jwt = require('jsonwebtoken');
const User = require('./_models/users');

// Middleware to check Gateway token
const verifyGatewayToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const { _id } = req.body;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    // Extract the token from the "Bearer" scheme
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid authorization format' });
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
        const expectedToken = generateGatewayToken(gateway.last_login, gateway.login_name);

        // Compare tokens
        if (token !== expectedToken) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Token is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Basic Authentication middleware
const basicGatewayAuthMiddleware = (req, res, next) => {
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return res.status(401).json({ message: 'Missing or invalid authentication credentials' });
    }
    req.login_name = user.name;
    req.login_pwd = user.pass;
    next();
};

// JWT Token verification middleware
const verifyUserToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Extract the token and verify
        req.userId = decoded.id;
        console.log("VERIFY TOKEN USER ID:::", req.userId)

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        next();
    } catch (error) {
        console.error('Error in token verification middleware:', error);
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

module.exports = { verifyGatewayToken, basicGatewayAuthMiddleware, verifyUserToken };
