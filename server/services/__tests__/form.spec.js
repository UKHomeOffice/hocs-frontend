jest.mock('../forms/index.js', () => ({
    getForm: jest.fn(),
    getFormForCase: jest.fn()
}));

jest.mock('../../clients', () => ({
    workflowService: {
        get: jest.fn(() => Promise.resolve())
    }
}));

const mockActionForm = {
    schema: {
        fields: []
    }
};

describe('getFormForAction', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should add the form to the request object when the call to the form repository succeeds ', async () => {
        req = {
            params: {
                workflow: 'WORKFLOW',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getForm.mockImplementation(() => {
            return mockActionForm;
        });
        const { getFormForAction } = require('../form');
        await getFormForAction(req, res, next);
        expect(formRepository.getForm).toHaveBeenCalled();
        expect(formRepository.getForm).toHaveBeenCalledTimes(1);
        expect(formRepository.getForm.mock.calls[0][0].context).toEqual('ACTION');
        expect(formRepository.getForm.mock.calls[0][0].workflow).toEqual('WORKFLOW');
        expect(formRepository.getForm.mock.calls[0][0].user.id).toEqual('test');
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an intance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                workflow: 'WORKFLOW',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getForm.mockImplementation(() => {
            throw new Error('SOMETHING_WENT_WRONG');
        });
        const { getFormForAction } = require('../form');
        await getFormForAction(req, res, next);
        expect(formRepository.getForm).toHaveBeenCalled();
        expect(formRepository.getForm).toHaveBeenCalledTimes(1);
        expect(formRepository.getForm.mock.calls[0][0].context).toEqual('ACTION');
        expect(formRepository.getForm.mock.calls[0][0].workflow).toEqual('WORKFLOW');
        expect(formRepository.getForm.mock.calls[0][0].user.id).toEqual('test');
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});

describe('getFormForCase', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should add the form to the request object when the call to the form repository succeeds ', async () => {
        req = {
            params: {
                entity: 'ENTITY',
                context: 'CONTEXT',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getFormForCase.mockImplementation(() => {
            return mockActionForm;
        });
        const { getFormForCase } = require('../form');
        await getFormForCase(req, res, next);
        expect(formRepository.getFormForCase).toHaveBeenCalled();
        expect(formRepository.getFormForCase).toHaveBeenCalledTimes(1);
        expect(formRepository.getFormForCase.mock.calls[0][0].entity).toEqual('ENTITY');
        expect(formRepository.getFormForCase.mock.calls[0][0].context).toEqual('CONTEXT');
        expect(formRepository.getFormForCase.mock.calls[0][0].action).toEqual('ACTION');
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an intance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                entity: 'ENTITY',
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const formRepository = require('../forms/index.js');
        formRepository.getFormForCase.mockImplementation(() => {
            throw new Error('SOMETHING_WENT_WRONG');
        });
        const { getFormForCase } = require('../form');
        await getFormForCase(req, res, next);
        expect(formRepository.getFormForCase).toHaveBeenCalled();
        expect(formRepository.getFormForCase).toHaveBeenCalledTimes(1);
        expect(formRepository.getFormForCase.mock.calls[0][0].entity).toEqual('ENTITY');
        expect(formRepository.getFormForCase.mock.calls[0][0].action).toEqual('ACTION');
        expect(req.form).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});

describe('getFormForStage', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should add the form to the request object when the call to the form repository succeeds ', async () => {
        req = {
            params: {
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const { workflowService } = require('../../clients');
        workflowService.get.mockImplementation(() => Promise.resolve({ data: { form: mockActionForm } }));
        const { getFormForStage } = require('../form');
        await getFormForStage(req, res, next);
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an intance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                action: 'ACTION'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };
        const { workflowService } = require('../../clients');
        workflowService.get.mockImplementation(() => Promise.reject({ stack: 'ERR_STACK', response: { status: 500 } }));
        const { getFormForStage } = require('../form');
        await getFormForStage(req, res, next);
        expect(req.form).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});