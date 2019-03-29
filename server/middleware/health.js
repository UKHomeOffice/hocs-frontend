const { caseworkService, workflowService, infoService, documentService } = require('../clients');
const { s3 } = require('../libs/aws');
const { S3: { BUCKET_NAME } } = require('../config').forContext('AWS');

const status = {
    READY: 'READY',
    FAIL: 'FAIL',
    NOT_READY: 'NOT_READY'
};

function liveness(req, res) {
    try {
        res.status(200).json({
            status: status.READY
        });
    } catch (e) {
        res.status(500).json({
            status: status.FAIL
        });
    }
}

async function readiness(req, res) {
    const setStatus = response => response.status === 200 ? status.READY : status.NOT_READY;
    const setResponseCode = (resources, storage) => {
        return resources.casework === status.READY &&
            resources.workflow === status.READY &&
            resources.info === status.READY &&
            resources.documents === status.READY &&
            storage.s3 === status.READY;
    };
    const response = {};
    const resources = {};
    const storage = {};
    try {
        const casework = await caseworkService.get('/actuator/health');
        resources.casework = setStatus(casework);
    } catch (e) {
        resources.casework = status.FAIL;
    }
    try {
        const workflow = await workflowService.get('/actuator/health');
        resources.workflow = setStatus(workflow);
    } catch (e) {
        resources.workflow = status.FAIL;
    }
    try {
        const info = await infoService.get('/actuator/health');
        resources.info = setStatus(info);
    } catch (e) {
        resources.info = status.FAIL;
    }
    try {
        const documents = await documentService.get('/actuator/health');
        resources.documents = setStatus(documents);
    } catch (e) {
        resources.documents = status.FAIL;
    }
    s3.listObjects({ Bucket: BUCKET_NAME, MaxKeys: 1 }, err => {
        storage.s3 = !err ? status.READY : status.FAIL;
        response.code = setResponseCode(resources, storage) ? 200 : 503;
        response.status = setResponseCode(resources, storage) ? status.READY : status.NOT_READY;
        res.status(response.code).json({
            status: response.status,
            resources,
            storage
        });
    });
}

module.exports = {
    liveness,
    readiness
};