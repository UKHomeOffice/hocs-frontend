const router = require('express').Router();
const {getFormForAction, getFormForCase} = require('../../services/form');
const User = require('../../models/user');

router.use('/action/:action', (req, res, next) => {
    getFormForAction(req, res, next);
});

router.use('/case/:type/:action', (req, res, next) => {
    getFormForCase(req, res, next);
});

router.get('/action/:action', (req, res) => {
    const {action} = req.params;
    if (req.user && User.hasRole(req.user, action.toUpperCase())) {
        res.status(200).send(req.form.schema);
    } else {
        res.status(403).send();
    }
});

router.get('/case/:type/:action', (req, res) => {
    res.status(200).send(req.form.schema);

});

module.exports = router;