const getLogger = require('../libs/logger');
const { infoService } = require('../clients');
const User = require('../models/user');

const getFieldsForSchema = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_FIELDS', { ...req.params });
    const { user } = req;

    try {
        const headers = User.createHeaders(user);
        const response = await infoService.get(`/schema/${req.params.schemaType}/fields`, { headers });
        res.form = { schema: { fields: [ ...response.data] } };
        req.form = { schema: { fields: [ ...response.data] } };
        next();
    } catch (error) {
        logger.error('SCHEMA_FAILURE', { message: error.message });

        return next(Error('Failed to fetch fields for schema'));
    }
};

module.exports = {
    getFieldsForSchema
};
