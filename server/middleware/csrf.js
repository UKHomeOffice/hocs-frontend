const csurf = require('csurf');

const csrfMiddleware = csurf({
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
});

module.exports = { csrfMiddleware };
