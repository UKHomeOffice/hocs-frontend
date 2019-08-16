const csurf = require('csurf');
const { isProduction } = require('../config');

const csrfMiddleware = csurf({
    cookie: {
        path: '*',
        httpOnly: true,
        secure: isProduction,
        maxAge: 3600
    }
});

module.exports = { csrfMiddleware };
