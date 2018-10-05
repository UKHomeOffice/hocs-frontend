const router = require('express').Router();
const { getList } = require('../../services/list');

router.get('/', async (req, res) => {
    const dashboard = await getList('DASHBOARD', { ...req.params, user: req.user });
    res.json(dashboard);
});

module.exports = router;