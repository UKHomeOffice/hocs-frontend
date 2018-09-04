const { caseworkServiceClient } = require('../libs/request');
const { s3 } = require('../libs/aws');

function getDocument(req, res) {
    res.setHeader('Cache-Control', 'max-age=86400');
    s3.getObject({
        Bucket: 'hocs-secure-bucket',
        Key: req.params.documentId
    }).createReadStream().pipe(res);
}

function getDocumentList(req, res, next) {
    caseworkServiceClient.get(`/case/${req.params.caseId}/document`)
        .then(response => {
            res.locals.documents = response.data;
            next();
        })
        .catch(error => {
            res.status(404).send(error);
        });
}

function apiGetDocumentList(req, res) {
    caseworkServiceClient.get(`/case/${req.params.caseId}/document`, { responseType: 'stream' })
        .then(response => {
            response.data.pipe(res);
        })
        .catch(error => {
            res.status(404).send(error);
        });
}

module.exports = {
    getDocument,
    getDocumentList,
    apiGetDocumentList
};