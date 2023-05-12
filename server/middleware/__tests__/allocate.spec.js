const { allocationMiddleware } = require('../allocate.js');
const { caseworkService } = require('../../clients');
jest.mock('../../clients', () => ({
    caseworkService: {
        put: jest.fn()
    }
}));

describe('Allocate middleware', () => {
    let req = {};
    let res = {};
    const next = jest.fn();

    beforeEach(() => {
        res = {
            json: jest.fn()
        };
        req = {
            query: {
                type: 'OUT_OF_CONTACT'
            },
            params: {
                caseId: 'CASE_ID',
                stageId: 'STAGE_ID'
            },
            body: {
                'OutOfContactTeam': 'TEAM_UUID'
            },
            requestId: 'REQUEST_ID',
            user: {
                uuid: 'TEST_UUID',
                roles: [],
                groups: []
            }
        };
        next.mockReset();
    });

    it('should throw error if type not present', async () => {
        delete req.query.type;
        await allocationMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new Error('Type not specified for case CASE_ID allocation'));
    });

    it('should throw error if type not supported', async () => {
        req.query = { type: 'NOT_SUPPORTED' };

        await allocationMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new Error('Invalid type NOT_SUPPORTED for case CASE_ID allocation'));
    });

    describe('should call updateOutOfContact if type is OUT_OF_CONTACT', async () => {

        it('should set the teamUUID to OutOfContactTeam and saveLast to true if OutOfContactTeam is present',
            async () => {
                await allocationMiddleware(req, res, next);
                expect(caseworkService.put).toHaveBeenCalledWith(
                    '/case/CASE_ID/stage/STAGE_ID/team?saveLast=true&saveLastFieldName=XOutOfContactPreviousTeam',
                    { teamUUID: 'TEAM_UUID' },
                    { headers: { 'X-Correlation-Id': 'REQUEST_ID', 'X-Auth-Groups': '', 'X-Auth-Roles': '', 'X-Auth-UserId': 'TEST_UUID' } });
                expect(res.json).toHaveBeenCalledWith({ redirect: '/case/CASE_ID/stage/STAGE_ID?tab=OUT_OF_CONTACT' });
            });

        it('should set the teamUUID to XOutOfContactPreviousTeam and saveLast to false if XOutOfContactPreviousTeam is present',
            async () => {
                req.body = {
                    'XOutOfContactPreviousTeam': 'TEAM_UUID'
                };
                await allocationMiddleware(req, res, next);
                expect(caseworkService.put).toHaveBeenCalledWith(
                    '/case/CASE_ID/stage/STAGE_ID/team?saveLast=false&saveLastFieldName=XOutOfContactPreviousTeam',
                    { teamUUID: 'TEAM_UUID' },
                    { headers: { 'X-Correlation-Id': 'REQUEST_ID', 'X-Auth-Groups': '', 'X-Auth-Roles': '', 'X-Auth-UserId': 'TEST_UUID' } });
                expect(res.json).toHaveBeenCalledWith({ redirect: '/case/CASE_ID/stage/STAGE_ID?tab=OUT_OF_CONTACT' });
            });

        it('should set the teamUUID to XOutOfContactPreviousTeam and saveLast to false if both team variables are present',
            async () => {
                req.body = {
                    'XOutOfContactPreviousTeam': 'OLD_TEAM_UUID',
                    'OutOfContactTeam': 'TEAM_UUID'
                };
                await allocationMiddleware(req, res, next);
                expect(caseworkService.put).toHaveBeenCalledWith(
                    '/case/CASE_ID/stage/STAGE_ID/team?saveLast=false&saveLastFieldName=XOutOfContactPreviousTeam',
                    { teamUUID: 'TEAM_UUID' },
                    { headers: { 'X-Correlation-Id': 'REQUEST_ID', 'X-Auth-Groups': '', 'X-Auth-Roles': '', 'X-Auth-UserId': 'TEST_UUID' } });
                expect(res.json).toHaveBeenCalledWith({ redirect: '/case/CASE_ID/stage/STAGE_ID?tab=OUT_OF_CONTACT' });
            });

    });
});
