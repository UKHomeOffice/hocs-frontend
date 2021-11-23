async function setCacheControl(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, pre-check=0, post-check=0, max-age=0, s-maxage=0');
    next();
}

module.exports = {
    setCacheControl
};
