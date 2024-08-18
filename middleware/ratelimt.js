const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute window
    max: 100, // limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later.'
});

module.exports = rateLimiter