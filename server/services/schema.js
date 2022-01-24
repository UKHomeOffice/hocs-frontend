const getLogger = require('../libs/logger');
const { infoService } = require('../clients');
const User = require('../models/user');

async function getFieldsFromInfoService(options, user) {
    const { schemaType } = options;
    const headers = User.createHeaders(user);

    try {
        return await infoService.get(`/schema/${schemaType}/fields`, { headers });
    } catch (error) {
        return { error: new Error('Error getting fields for schema')};
    }

}

const getFieldsForSchema = async (req, res, next) => {

    const logger = getLogger(req.requestId);
    logger.info('GET_FIELDS', { ...req.params });
    const { user } = req;

    try {
        const response = await getFieldsFromInfoService(req.params, user);
        res.form = response.data;
        next();
    } catch (error) {
        logger.error('SCHEMA_FAILURE', { message: error.message });

        return next(Error('Failed to fetch fields for schema'));
    }
};

module.exports = {
    getFieldsForSchema
};
