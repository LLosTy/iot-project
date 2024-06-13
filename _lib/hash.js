const crypto = require('crypto');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

/**
 * Generate a SHA-256 token using last_login, login_name, and LOGIN_ENCODE
 * @param {Date} lastLogin - The last login time of the gateway
 * @param {String} loginName - The login name of the gateway
 * @returns {String} - The generated SHA-256 token
 */
const generateGatewayToken = (lastLogin, loginName) => {
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

module.exports = { generateGatewayToken };
