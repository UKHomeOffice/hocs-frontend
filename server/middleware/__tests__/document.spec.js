const {
    getOriginalDocument,
    getPdfDocument,
    getDocumentList,
    apiGetDocumentList
} = require('../document');

jest.mock('../../clients', () => ({
    caseworkService: {
        get: jest.fn()
    }
}));
const { caseworkService } = require('../../clients');

describe('Document middleware', () => {

    describe('Get original document middleware', () => {

        let req = {};
        let res = {};
        const mockResponse = { data: {}, headers: { 'content-disposition': 'TEST' } };
        const next = jest.fn();
        const mockUser = { username: 'TEST_USER', uuid: 'TEST', roles: [], groups: [] };

        beforeEach(() => {
            next.mockReset();
            req = { params: { documentId: '1234', caseId: '5522' }, user: mockUser };
            res = { setHeader: jest.fn() };
            mockResponse.status = 200;
            mockResponse.data.on = jest.fn();
            mockResponse.data.pipe = jest.fn();

        });

        const expecteOptions = {
            headers: { 'X-Auth-Groups': '', 'X-Auth-Roles': '', 'X-Auth-UserId': 'TEST' },
            responseType: 'stream'
        };

        it('should pipe the response on success', async () => {
            caseworkService.get.mockImplementation(() => Promise.resolve(mockResponse));
            await getOriginalDocument(req, res, next);
            expect(caseworkService.get).toHaveBeenCalled();
            expect(caseworkService.get).toHaveBeenCalledWith('/case/5522/document/1234/file', expecteOptions);
            expect(res.setHeader).toHaveBeenCalled();
            expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'max-age=86400');
            expect(mockResponse.data.pipe).toHaveBeenCalled();
            expect(mockResponse.data.pipe).toHaveBeenCalledWith(res);
        });

        it('should call next with an error if request fails', async () => {
            const mockError = new Error('Unable to retrieve original document');
            caseworkService.get.mockImplementation(() => Promise.reject(mockError));
            await getOriginalDocument(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

    describe('Get pdf document middleware', () => {

        let req = {};
        let res = {};
        const mockResponse = { data: {}, headers: { 'content-disposition': 'TEST' } };
        const next = jest.fn();
        const mockUser = { username: 'TEST_USER', uuid: 'TEST', roles: [], groups: [] };

        beforeEach(() => {
            next.mockReset();
            req = { params: { documentId: '1234', caseId: '5522' }, user: mockUser };
            res = { setHeader: jest.fn() };
            mockResponse.status = 200;
            mockResponse.data.on = jest.fn();
            mockResponse.data.pipe = jest.fn();

        });

        const expecteOptions = {
            headers: { 'X-Auth-Groups': '', 'X-Auth-Roles': '', 'X-Auth-UserId': 'TEST' },
            responseType: 'stream'
        };

        it('should pipe the response on success', async () => {
            caseworkService.get.mockImplementation(() => Promise.resolve(mockResponse));
            await getPdfDocument(req, res, next);
            expect(caseworkService.get).toHaveBeenCalled();
            expect(caseworkService.get).toHaveBeenCalledWith('/case/5522/document/1234/pdf', expecteOptions);
            expect(res.setHeader).toHaveBeenCalled();
            expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'max-age=86400');
            expect(mockResponse.data.pipe).toHaveBeenCalled();
            expect(mockResponse.data.pipe).toHaveBeenCalledWith(res);
        });

        it('should call next with an error if request fails', async () => {
            const mockError = new Error('Unable to retrieve PDF document');
            caseworkService.get.mockImplementation(() => Promise.reject(mockError));
            await getPdfDocument(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });

    describe('Get document list middleware', () => {

        let req = {};
        let res = {};
        const next = jest.fn();

        beforeEach(() => {
            next.mockReset();
            req = {
                params: {
                    caseId: '1234'
                },
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'CASE_DOCUMENT_LIST') {
                            return Promise.resolve('MOCK_DOCUMENT_LIST');
                        }
                        return Promise.reject();
                    })
                }
            };
            res = { locals: {} };

        });

        it('should create a documents list on res.locals', async () => {
            await getDocumentList(req, res, next);
            expect(res.locals.documents).toBeDefined();
            expect(res.locals.documents).toEqual('MOCK_DOCUMENT_LIST');
            expect(next).toHaveBeenCalled();
        });

        it('should create an empty documents list on res.locals if fetchList fails', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject(new Error('Promise failed')));
            await getDocumentList(req, res, next);
            expect(res.locals.documents).toBeDefined();
            expect(res.locals.documents).toEqual([]);
            expect(next).toHaveBeenCalled();
        });

    });

    describe('Workstack API response.middleware', () => {

        let req = {};
        let res = {};
        const json = jest.fn();

        beforeEach(() => {
            json.mockReset();
            req = {};
            res = {
                locals: { documents: 'MOCK_DOCUMENT_LIST' },
                status: jest.fn(() => ({ json }))
            };
        });

        it('should send the dashboard data from res.locals', () => {
            apiGetDocumentList(req, res);
            expect(res.status).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalled();
            expect(json).toHaveBeenCalledWith('MOCK_DOCUMENT_LIST');
        });
    });

});