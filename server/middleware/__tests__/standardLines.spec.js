const {
    getUsersStandardLines,
    getAllStandardLines,
    getOriginalDocument,
} = require('./../standardLine');

jest.mock('../../clients/index');
jest.mock('../../models/user');
const { infoService, documentService } = require('../../clients/index');
const User = require('../../models/user');

const next = jest.fn();
let req = {};
let res = {};

const mockUser = { username: 'TEST_USER', uuid: 'TEST', roles: [], groups: [] };
const headers = '__headers__';

describe('standard lines middlware', () => {

    describe('getUsersStandardLines is called', () => {

        const MOCK_STANDARD_LINE = {
            data: [{
                uuid: 'test',
                displayName: 'test',
                topicUUID: 'test',
                expires: '9999-12-31',
                documentUUID: 'test'
            }]
        };

        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'TOPICS') {
                            return Promise.resolve(['MOCK_TOPICS']).catch((error) => {});
                        } else if (list === 'DCU_POLICY_TEAM_FOR_TOPIC') {
                            return Promise.resolve(['MOCK_TEAMS']).catch((error) => {});
                        }
                        return Promise.reject().catch((error) => {});
                    })
                },
                user: mockUser,
                requestId: 'reqid',
            };
            res = {
                locals: {}
            };
        });

        it('should call next with an error if unable to retrieve topics data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR').catch((error) => {}));
            await getUsersStandardLines(req, res, next);
            expect(res.locals.standardLines).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });

        it('should call next with an error if unable to retrieve topics data', async () => {
            req.listService.fetch.mockImplementation((list ) => {
                if (list === 'TOPICS') {
                    return Promise.resolve(['MOCK_TOPICS']).catch((error) => {});
                }
                return Promise.reject('MOCK_ERROR').catch((error) => {});
            });
            await getUsersStandardLines(req, res, next);
            expect(res.locals.standardLines).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });

        it('should call the user create headers method', async () => {
            await getUsersStandardLines(req, res, next);
            expect(User.createHeaders).toHaveBeenCalled();
        });

        it('should call the get method on the info service', async () => {
            User.createHeaders.mockImplementation(() => headers);
            await getUsersStandardLines(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith(`/user/${req.user.uuid}/standardLine`, { }, { headers: headers });
        });

        it('should call the get method on the info service', async () => {
            User.createHeaders.mockImplementation(() => headers);
            infoService.get.mockImplementation(() => Promise.resolve(MOCK_STANDARD_LINE).catch((error) => {}));
            await getUsersStandardLines(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith(`/user/${req.user.uuid}/standardLine`, { }, { headers: headers });
            expect(res.locals.standardLines).toEqual(
                [{ 'displayName': 'test', 'documentUUID': 'test', 'expiryDate': '31/12/9999','isExpired': false,'team': 'test','topic': 'test','uuid': 'test' }]
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('getAllStandardLines is called', () => {

        const MOCK_STANDARD_LINE = {
            data: [{
                uuid: 'test',
                displayName: 'test',
                topicUUID: 'test',
                expires: '9999-12-31',
                documentUUID: 'test'
            }]
        };

        beforeEach(() => {
            next.mockReset();
            req = {
                listService: {
                    fetch: jest.fn(async (list) => {
                        if (list === 'TOPICS') {
                            return Promise.resolve(['MOCK_TOPICS']).catch((error) => {});
                        } else if (list === 'DCU_POLICY_TEAM_FOR_TOPIC') {
                            return Promise.resolve(['MOCK_TEAMS']).catch((error) => {});
                        }
                        return Promise.reject().catch((error) => {});
                    })
                },
                requestId: 'reqid',
            };
            res = {
                locals: {}
            };
        });

        it('should call next with an error if unable to retrieve topics data', async () => {
            req.listService.fetch.mockImplementation(() => Promise.reject('MOCK_ERROR').catch((error) => {}));
            await getAllStandardLines(req, res, next);
            expect(res.locals.standardLines).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });

        it('should call next with an error if unable to retrieve topics data', async () => {
            req.listService.fetch.mockImplementation((list ) => {
                if (list === 'TOPICS') {
                    return Promise.resolve(['MOCK_TOPICS']);
                }
                return Promise.reject('MOCK_ERROR');
            });
            await getAllStandardLines(req, res, next);
            expect(res.locals.standardLines).not.toBeDefined();
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith('MOCK_ERROR');
        });

        it('should call the user create headers method', async () => {
            await getAllStandardLines(req, res, next);
            expect(User.createHeaders).toHaveBeenCalled();
        });

        it('should call the get method on the info service', async () => {
            User.createHeaders.mockImplementation(() => headers);
            await getAllStandardLines(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/standardLine/all', { }, { headers: headers });
        });

        it('should call the get method on the info service', async () => {
            User.createHeaders.mockImplementation(() => headers);
            infoService.get.mockImplementation(() => Promise.resolve(MOCK_STANDARD_LINE));
            await getAllStandardLines(req, res, next);
            expect(infoService.get).toHaveBeenCalledWith('/standardLine/all', { }, { headers: headers });
            expect(res.locals.standardLines).toEqual(
                [{ 'displayName': 'test', 'documentUUID': 'test', 'expiryDate': '31/12/9999','isExpired': false,'team': 'test','topic': 'test','uuid': 'test' }]
            );
            expect(next).toHaveBeenCalled();
        });
    });

    describe('getOriginalDocument is called', () => {

        const mockResponse = { data: {}, headers: { 'content-disposition': 'TEST' } };

        beforeEach(() => {
            next.mockReset();
            req = { params: { documentId: '1234' }, user: mockUser };
            res = { setHeader: jest.fn() };
            mockResponse.status = 200;
            mockResponse.data.on = jest.fn();
            mockResponse.data.pipe = jest.fn();
        });

        it('should pipe the response on success', async () => {
            documentService.get.mockImplementation(() => Promise.resolve(mockResponse));
            await getOriginalDocument(req, res, next);
            expect(documentService.get).toHaveBeenCalled();
            expect(documentService.get).toHaveBeenCalledWith(`/document/${req.params.documentId}/file`, { headers:headers, responseType: 'stream' });
            expect(res.setHeader).toHaveBeenCalled();
            expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'max-age=86400');
            expect(mockResponse.data.pipe).toHaveBeenCalled();
            expect(mockResponse.data.pipe).toHaveBeenCalledWith(res);
        });

        it('should call next with an error if request fails', async () => {
            const mockError = new Error('Unable to retrieve original document');
            documentService.get.mockImplementation(() => Promise.reject(mockError));
            await getOriginalDocument(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

    });
});
