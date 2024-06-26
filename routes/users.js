const express = require('express');
const Users = require("../_models/users.js");
const jwt = require('jsonwebtoken');
const { basicUserLogin, verifyUserTokenLogin } = require('../authMiddleware.js');
const router = express.Router();


// Route to get user token with authentication
router.get('/', async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    if (authorization.startsWith('Basic')) {
        // Use Basic Auth
        return basicUserLogin(req, res, async () => {
            const user = await Users.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            // Save token to the user record
            user.token = token;
            await user.save();

            return res.status(200).json({ token });
        });
        
    } else if (authorization.startsWith('Bearer')) {
        // Use OAuth2
        return verifyUserTokenLogin(req, res, async () => {
            const user = await Users.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Return the previously generated JWT token stored in the database
            return res.status(200).json({ token: user.token });
        });
    } else {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
});


module.exports = router;
