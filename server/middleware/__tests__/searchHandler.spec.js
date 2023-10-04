/**
 * @jest-environment node
 */
const { handleSearch } = require('../searchHandler.js');
const { caseworkService } = require('../../clients');

jest.mock('../../clients', () => ({
    caseworkService: {
        post: jest.fn()
    }
}));

let req = {};
let res = {};
const mockUser = { username: 'TEST_USER', uuid: 'TEST', roles: [], groups: [] };
const next = jest.fn();

describe('handleSearch', () => {
    beforeEach(() => {
        next.mockReset();
        req = {
            form: {
                data: {
                    'reference': 'ref',
                    'caseTypes': 'CT1',
                    'dateReceivedTo': '20-10-2019',
                    'dateReceivedFrom': '10-10-2019',
                    'correspondentAddress1': 'Address1',
                    'correspondentEmail': 'email@example.com',
                    'correspondent': 'Bob',
                    'correspondentNameNotMember': 'Bobby',
                    'correspondentPostcode': 'Postcode',
                    'topic': 'Test Topic',
                    'signOffMinister': 'Min123',
                    'claimantName': 'test Name',
                    'claimantDOB': '12-11-1967',
                    'niNumber': 'SJ0000000',
                    'PrevHocsRef': 'PREV_HOCS_REF',
                    'caseStatus': 'active',
                    'CampaignType': 'Test Campaign 123',
                    'MinSignOffTeam': 'Test Min Sign Off Team'
                }
            },
            requestId: '00000000-0000-0000-0000-000000000000',
            user: mockUser,
            listService: {
                getFromStaticList: jest.fn(async (listId, key) => {
                    if (listId === 'S_ALL_TEAMS' && key === 'T1') {
                        return Promise.resolve('TEAM1');
                    }
                    if (listId === 'S_CASETYPES' && key === 'CT1') {
                        return Promise.resolve('CaseType1');
                    }
                    if (listId === 'S_STAGETYPES' && key === 'ST1') {
                        return Promise.resolve('StageType1');
                    }
                    return Promise.reject();
                }),
                fetch: jest.fn(async (listId) => {
                    if (listId === 'S_SYSTEM_CONFIGURATION') {
                        return Promise.resolve({
                            workstackTypeColumns: [
                                { workstackType: 'DEFAULT', workstackColumns: {} },
                                { workstackType: 'TypeB', workstackColumns: {} }
                            ]
                        }
                        );
                    }
                    return Promise.reject();
                })
            }
        };
        res = {
            locals: {}
        };
        caseworkService.post.mockImplementation(() => Promise.resolve({
            data: {
                stages: [
                    { caseReference: 'ref2', teamUUID: 'T1', caseType: 'CT1', stageType: 'ST1', active: true },
                    { caseReference: 'ref1', teamUUID: 'T1', caseType: 'CT1', stageType: 'ST1', active: true },
                    { caseReference: 'ref3', teamUUID: 'T1', caseType: 'CT1', stageType: 'ST1', active: true }
                ]
            }
        }));
    });

    it('should create an ordered workstackTypeColumns object on res.locals', async () => {
        await handleSearch(req, res, next);

        const expectedRequest = {
            reference: 'REF',
            caseType: 'CT1',
            dateReceived: {
                to: '20-10-2019',
                from: '10-10-2019'
            },
            correspondentExternalKey: undefined,
            correspondentAddress1: 'Address1',
            correspondentEmail: 'email@example.com',
            correspondentName: 'Bob',
            correspondentNameNotMember: 'Bobby',
            correspondentPostcode: 'Postcode',
            correspondentReference: '',
            topic: 'Test Topic',
            poTeamUuid: 'Min123',
            data: {
                FullName: 'test Name',
                DateOfBirth: '12-11-1967',
                NI: 'SJ0000000',
                PrevHocsRef: 'PREV_HOCS_REF',
                CampaignType: 'Test Campaign 123',
                MinSignOffTeam: 'Test Min Sign Off Team'
            },
            activeOnly: true
        };

        const expectedHeaders = {
            headers: {
                'X-Auth-Groups': '',
                'X-Auth-Roles': '',
                'X-Auth-UserId': 'TEST',
                'X-Correlation-Id': '00000000-0000-0000-0000-000000000000'
            }
        };

        expect(res.locals.workstack).toBeDefined();
        expect(res.locals.workstack.items.length).toEqual(3);
        expect(res.locals.workstack.items[0].caseReference).toEqual('ref1');
        expect(res.locals.workstack.items[1].caseReference).toEqual('ref2');
        expect(res.locals.workstack.items[2].caseReference).toEqual('ref3');
        expect(res.locals.workstack.items[2].teamUUID).toEqual('T1');
        expect(res.locals.workstack.items[2].assignedTeamDisplay).toEqual('TEAM1');
        expect(res.locals.workstack.items[2].caseType).toEqual('CT1');
        expect(res.locals.workstack.items[2].caseTypeDisplayFull).toEqual('CaseType1');
        expect(res.locals.workstack.items[2].stageType).toEqual('ST1');
        expect(res.locals.workstack.items[2].stageTypeDisplay).toEqual('StageType1');

        expect(next).toHaveBeenCalled();
        expect(caseworkService.post).toHaveBeenCalled();
        expect(caseworkService.post).toHaveBeenCalledWith('/search', expectedRequest, expectedHeaders);
    });
});
