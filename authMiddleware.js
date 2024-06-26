
require('dotenv').config({ path: '.env.local' });
const { OAuth2Client } = require('google-auth-library');
const basicAuth = require('basic-auth');
const Gateway = require("./_models/gateway");
const { generateGatewayToken } = require("./_lib/hash");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./_models/users');
const googleClient = new OAuth2Client(process.env.GOOGLE_ID);


// Middleware to check Gateway token
const verifyGatewayToken = async (req, res, next) => {
    const { authorization } = req.headers;
    const { _id } = req.body;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

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

// Basic Gateway Authentication middleware
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

// Basic Authentication middleware
const basicUserLogin = async (req, res, next) => {    
    const user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return res.status(401).json({ message: 'Missing or invalid authentication credentials' });
    }

    try {
        const dbUser = await User.findOne({ username: user.name });

        if (dbUser && user.pass === dbUser.password) {
            req.userId = dbUser._id;
            next();
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in basicAuth middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Google OAuth2 Token verification middleware
const verifyUserTokenLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    try {
        // Verify Google OAuth2 token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_ID,
        });

        const payload = ticket.getPayload();
        const userId = payload.sub;

        // Check if user exists in your database
        let user = await User.findOne({ googleId: userId });
        if (!user) {
            // Create a new user if it doesn't exist
            user = new User({
                googleId: userId,
                username: payload.email,
                displayName: payload.name,
                email: payload.email,
            });
            await user.save();
        }

        req.userId = user._id;

        // Generate a new JWT token for your application
        const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Save the JWT token to the user record
        user.token = appToken;
        await user.save();

        req.appToken = appToken;

        next();
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return res.status(401).send({ message: 'Unauthorized!' });
    }
};

module.exports = { 
    verifyGatewayToken, 
    basicGatewayAuthMiddleware, 
    verifyUserToken, 
    basicUserLogin ,
    verifyUserTokenLogin
};
