const getLogger = require('../libs/logger.js');
const { caseworkService } = require('../clients/index.js');
const User = require('../models/user.js');

const getReportList = async (req, res, next) => {
    const logger = getLogger(req.request);

    try {
        logger.info('REQUEST_REPORT_LIST', { ...req.params });

        // TODO: limit to reports that the user has permission to access
        const listOfReports = await req.listService.fetch('OPERATIONAL_REPORTS');

        res.json(listOfReports);
    } catch (error) {
        logger.error('REQUEST_REPORT_LIST', { message: error.message, stack: error.stack });
        next(error);
    }
};

const streamReport = async (req, res, next) => {
    const logger = getLogger(req.request);

    try {
        logger.info('REQUEST_REPORT_DATA', { ...req.params });
        const { reportSlug } = req.params;
        // TODO: is there a standard way to validate/throw errors?#
        if(!reportSlug || !reportSlug.match(/^[a-z-]+$/)) {
            logger.warn('REQUEST_REPORT_DATA_INVALID_SLUG', { ...req.params });
            return res.status(400).json({ error: 'Report slug should be non-empty kebab-case.' });
        }

        const reportMetadata = await req.listService.getFromStaticList('OPERATIONAL_REPORTS', reportSlug);
        if(!reportMetadata) {
            logger.warn('REQUEST_REPORT_DATA_REPORT_SLUG_NOT_FOUND', { ...req.params });
            return res.status(404).json({ error: `No report found for ${reportSlug}` });
        }

        // TODO: limit to reports/case types the user has permission to access
        const response = await caseworkService.get(
            `/report/${reportSlug}`,
            {
                headers: User.createHeaders(req.user),
                responseType: 'stream'
            }
        );

        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_REPORT_DATA', { message: error.message, stack: error.stack });
        next(error);
    }
};

const getReportMetadata = async (req, res, next) => {
    const logger = getLogger(req.request);

    try {
        logger.info('REQUEST_REPORT_METADATA', { ...req.params });
        const { reportSlug } = req.params;
        // TODO: is there a standard way to validate/throw errors?#
        if(!reportSlug || !reportSlug.match(/^[a-z-]+$/)) {
            logger.warn('REQUEST_REPORT_METADATA_INVALID_SLUG', { ...req.params });
            return res.status(400).json({ error: 'Report slug should be non-empty kebab-case.' });
        }

        const reportMetadata = await req.listService.getFromStaticList('OPERATIONAL_REPORTS', reportSlug);

        if(!reportMetadata) {
            logger.warn('REQUEST_REPORT_METADATA_REPORT_SLUG_NOT_FOUND', { ...req.params });
            return res.status(404).json({ error: `No report found for ${reportSlug}` });
        }

        res.json(reportMetadata);
    } catch (error) {
        logger.error('REQUEST_REPORT_METADATA', { message: error.message, stack: error.stack });
        next(error);
    }
};

module.exports = {
    getReportList,
    streamReport,
    getReportMetadata,
};
