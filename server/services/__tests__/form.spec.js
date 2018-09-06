jest.mock('../forms/index.js', () => ({
    getForm: jest.fn()
}));

jest.mock('../../libs/request.js', () => ({
    workflowServiceClient: {
        get: jest.fn(() => Promise.resolve())
    }
}));

jest.mock('../list.js', () => ({
    getList: jest.fn(() => Promise.resolve())
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
            user: 'USER'
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
        expect(formRepository.getForm.mock.calls[0][0].user).toEqual('USER');
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an intance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                workflow: 'WORKFLOW',
                action: 'ACTION'
            },
            user: 'USER'
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
        expect(formRepository.getForm.mock.calls[0][0].user).toEqual('USER');
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
                action: 'ACTION'
            },
            user: 'USER'
        };
        const formRepository = require('../forms/index.js');
        formRepository.getForm.mockImplementation(() => {
            return mockActionForm;
        });
        const { getFormForCase } = require('../form');
        await getFormForCase(req, res, next);
        expect(formRepository.getForm).toHaveBeenCalled();
        expect(formRepository.getForm).toHaveBeenCalledTimes(1);
        expect(formRepository.getForm.mock.calls[0][0].context).toEqual('WORKFLOW');
        expect(formRepository.getForm.mock.calls[0][0].action).toEqual('ACTION');
        expect(formRepository.getForm.mock.calls[0][0].user).toEqual('USER');
        expect(req.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });

    it('should add an intance of the ErrorModel on the response object when the call to the form repository fails', async () => {
        req = {
            params: {
                action: 'ACTION'
            },
            user: 'USER'
        };
        const formRepository = require('../forms/index.js');
        formRepository.getForm.mockImplementation(() => {
            throw new Error('SOMETHING_WENT_WRONG');
        });
        const { getFormForCase } = require('../form');
        await getFormForCase(req, res, next);
        expect(formRepository.getForm).toHaveBeenCalled();
        expect(formRepository.getForm).toHaveBeenCalledTimes(1);
        expect(formRepository.getForm.mock.calls[0][0].context).toEqual('WORKFLOW');
        expect(formRepository.getForm.mock.calls[0][0].action).toEqual('ACTION');
        expect(formRepository.getForm.mock.calls[0][0].user).toEqual('USER');
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
            user: 'USER'
        };
        const request = require('../../libs/request.js');
        request.workflowServiceClient.get.mockImplementation(() => Promise.resolve({ data: { form: mockActionForm } }));
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
            user: 'USER'
        };
        const request = require('../../libs/request.js');
        request.workflowServiceClient.get.mockImplementation(() => Promise.reject({ stack: 'ERR_STACK' }));
        const { getFormForStage } = require('../form');
        await getFormForStage(req, res, next);
        expect(req.form).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    });

});