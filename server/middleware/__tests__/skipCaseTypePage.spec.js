const { skipCaseTypePage, skipCaseTypePageApi } = require('../skipCaseTypePage.js');

describe('when the skip middleware is called', () => {

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

        json.mockReset();
        next.mockReset();
        redirect.mockReset();
    });

    describe('and it is an api request', () => {
        it('should send a callback URL', async () => {
            expect.assertions(2);
            const caseTypes = [{ key: 'casetype1' }];
            req.listService.fetch.mockImplementation(() => Promise.resolve(caseTypes).catch(() => {}));
            const responseData = { redirect: `/action/create/${caseTypes[0].key}/DOCUMENT` };

            await skipCaseTypePageApi(req, res, next);

            expect(json).toHaveBeenCalledTimes(1);
            expect(json).toHaveBeenCalledWith(responseData);
        });

        it('should call next with an error msg when list service is down', async () => {
            const mockError = new Error('TEST_ERROR');
            req.listService.fetch.mockReturnValue(Promise.reject(mockError).catch(() => {}));

            await skipCaseTypePageApi(req, res, next);

            expect(json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

        it('should not redirect when the workflow parameter is not correct', async () => {
            req.params.action = 'workflow';
            req.params.workflow = '__workflow__';

            await skipCaseTypePageApi(req, res, next);

            expect(json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith();
        });

        it('should not redirect when the action parameter is not correct', async () => {
            req.params.action = '__action__';
            req.params.workflow = 'create';

            await skipCaseTypePageApi(req, res, next);

            expect(json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith();
        });

        it('should not redirect when there are multiple case types', async () => {
            const caseTypes = [{ key: 'casetype1' }, { key: 'casetype2' }, { key: 'casetype3' }];
            req.listService.fetch.mockImplementation(() => Promise.resolve(caseTypes).catch(() => {}));

            await skipCaseTypePageApi(req, res, next);

            expect(json).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith();
        });
    });

    describe('and it is a page route', () => {
        it('should send a redirect to the create casetype/document url', async () => {
            const caseTypes = [{ key: 'casetype1' }];
            req.listService.fetch.mockImplementation(() => Promise.resolve(caseTypes).catch(() => {}));

            await skipCaseTypePage(req, res, next);
            expect(redirect).toHaveBeenCalledWith(`/action/create/${caseTypes[0].key}/DOCUMENT`);
        });

        it('should call next with an error msg when list service is down', async () => {
            const mockError = new Error('TEST_ERROR');
            req.listService.fetch.mockReturnValue(Promise.reject(mockError).catch(() => {}));

            await skipCaseTypePage(req, res, next);

            expect(redirect).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(mockError);
        });

        it('should not redirect when the workflow parameter is not correct', async () => {
            req.params.action = 'workflow';
            req.params.workflow = '__workflow__';

            await skipCaseTypePage(req, res, next);

            expect(redirect).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith();
        });

        it('should not redirect when the action parameter is not correct', async () => {
            req.params.action = '__action__';
            req.params.workflow = 'create';

            await skipCaseTypePage(req, res, next);

            expect(redirect).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith();
        });

        it('should not redirect when there are multiple case types', async () => {
            const caseTypes = [{ key: 'casetype1' }, { key: 'casetype2' }, { key: 'casetype3' }];
            req.listService.fetch.mockImplementation(() => Promise.resolve(caseTypes).catch(() => {}));

            await skipCaseTypePage(req, res, next);

            expect(redirect).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith();
        });
    });
});
