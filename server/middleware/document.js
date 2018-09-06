const { caseworkServiceClient } = require('../libs/request');
const { DocumentError } = require('../models/error');
const { s3 } = require('../libs/aws');

function getDocument(req, res) {
    res.setHeader('Cache-Control', 'max-age=86400');
    s3.getObject({
        Bucket: 'hocs-secure-bucket',
        Key: req.params.documentId
    }).createReadStream().pipe(res);
}

async function getDocumentList(req, res, next) {
    try {
        const response = await caseworkServiceClient.get(`/case/${req.params.caseId}/document`);
        res.locals.documents = response.data;
        next();
    } catch (e) {
        throw new DocumentError('Request failed');
    }
}

async function apiGetDocumentList(req, res) {
    try {
        const response = await caseworkServiceClient.get(`/case/${req.params.caseId}/document`, { responseType: 'stream' });
        response.data.pipe(res);
    } catch (e) {
        throw new DocumentError('Request failed');
    }
}

module.exports = {
    getDocument,
    getDocumentList,
    apiGetDocumentList
};