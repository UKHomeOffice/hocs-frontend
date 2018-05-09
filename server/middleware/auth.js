const authentication = (req, res, next) => {
    console.log('AUTH MIDDLEWARE');
    next();
};

module.exports = authentication;