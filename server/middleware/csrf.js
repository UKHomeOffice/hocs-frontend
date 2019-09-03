const csurf = require('csurf');

const csrfMiddleware = csurf({
    cookie: {
        path: '/',
        httpOnly: true,
        secure: true
    }
});

module.exports = { csrfMiddleware };
