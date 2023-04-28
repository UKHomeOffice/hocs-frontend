const getLogger = require('../libs/logger.js');
const { caseworkService } = require('../clients/index.js');
const User = require('../models/user.js');

const getReportList = async (req, res, next) => {
    const logger = getLogger(req.request);
    const { caseType } = req.params;

    try {
        logger.info('REQUEST_REPORT_LIST', { ...req.params });

        const listOfReports = (await req.listService.fetch('OPERATIONAL_REPORTS')).map(entry => entry.value);

        const reportsForCaseType = listOfReports.filter(r => r?.supported_case_types.includes(caseType));

        if (reportsForCaseType.length === 0) {
            return res.status(404).json({ error: `No reports for case type ${caseType}` });
        }

        res.json(reportsForCaseType);
    } catch (error) {
        logger.error('REQUEST_REPORT_LIST', { message: error.message, stack: error.stack });
        return next(error);
    }
};

const streamReport = async (req, res, next) => {
    const logger = getLogger(req.request);

    try {
        logger.info('REQUEST_REPORT_DATA', { ...req.params });
        const { caseType, reportSlug } = req.params;

        if (!caseType || !caseType.match(/^[A-Z0-9]+$/)) {
            logger.warn('REQUEST_REPORT_DATA_INVALID_CASE_TYPE', { ...req.params });
            return res.status(400).json({ error: 'Case type should be uppercase alphanumeric.' });
        }

        if (!reportSlug || !reportSlug.match(/^[a-z0-9-]+$/)) {
            logger.warn('REQUEST_REPORT_DATA_INVALID_SLUG', { ...req.params });
            return res.status(400).json({ error: 'Report slug should be non-empty kebab-case.' });
        }

        const reportMetadata = await req.listService.getFromStaticList('OPERATIONAL_REPORTS', reportSlug);
        if (!reportMetadata) {
            logger.warn('REQUEST_REPORT_DATA_REPORT_SLUG_NOT_FOUND', { ...req.params });
            return res.status(404).json({ error: `No report found for ${reportSlug}` });
        }

        const response = await caseworkService.get(
            `/report/${caseType}/${reportSlug}`,
            {
                headers: { ...User.createHeaders(req.user), 'X-Correlation-Id': req.requestId } ,
                responseType: 'stream'
            }
        );

        res.setHeader('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        logger.error('REQUEST_REPORT_DATA', { message: error.message, stack: error.stack });
        return next(error);
    }
};

module.exports = {
    getReportList,
    streamReport,
};
