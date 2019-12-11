jest.mock('../../services/action.js', () => {
    return {
        performAction: jest.fn()
    };
});

describe('Stage middleware', () => {

    let req = {};
    let res = {};
    const next = jest.fn();
    const redirect = jest.fn();
    const fetch = jest.fn();
    const json = jest.fn();

    beforeEach(() => {
        req = {
            form: { errors: {} },
            params: {
                workflow: 'create',
                action: 'workflow'
            },
            listService: { fetch }
        };

        res = {
            json,
            redirect
        };

        next.mockReset();
        redirect.mockReset();
    });

    it('should send a callback URL', async () => {
        expect.assertions(2);
        const { skipCaseTypePage } = require('../skipCaseTypePage.js');
        const caseTypes = [{ key: 'casetype1' }];
        req.listService.fetch.mockImplementation(() => Promise.resolve(caseTypes));
        const object = { redirect: `/action/create/${caseTypes[0].key}/DOCUMENT` };

        await skipCaseTypePage(req, res, next);

        expect(json).toHaveBeenCalledTimes(1);
        expect(json).toHaveBeenCalledWith(object);
    });

    it('should call next with an error msg when list service is down', async () => {
        const { skipCaseTypePage } = require('../skipCaseTypePage.js');
        const mockError = new Error('TEST_ERROR');
        req.listService.fetch.mockReturnValue(Promise.reject(mockError));

        await skipCaseTypePage(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(mockError);
    });

    it('should call next when url is wrong', async () => {
        const { skipCaseTypePage } = require('../skipCaseTypePage.js');
        req.params.action = 'undefined';

        await skipCaseTypePage(req, res, next);

        expect(next).toHaveBeenCalled();
    });


    it('should send a 200/OK response and a callback URL', async () => {
        const { skipCaseTypePageOnReload } = require('../skipCaseTypePage.js');
        const caseTypes = [{ key: 'casetype1' }];
        req.listService.fetch.mockImplementation(() => Promise.resolve(caseTypes));
        const object = { url: `/action/create/${caseTypes[0].key}/DOCUMENT` };

        await skipCaseTypePageOnReload(req, res, next);

        expect(redirect).toHaveBeenCalled();
        expect(redirect).toHaveBeenCalledWith(object);
    });

    it('should call next with an error msg when list service is down', async () => {
        const { skipCaseTypePageOnReload } = require('../skipCaseTypePage.js');
        const mockError = new Error('TEST_ERROR');
        req.listService.fetch.mockReturnValue(Promise.reject(mockError));

        await skipCaseTypePageOnReload(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(mockError);
    });

});