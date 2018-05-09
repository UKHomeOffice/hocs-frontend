import actionModel from "../action";

describe('Action model', () => {
    it('should return a callback url for a supported action', () => {
        const action = 'submit';
        const data = {};
        const response = actionModel.performAction(action, data);

        expect(response).toBeDefined();
        expect(response).toHaveProperty('callbackUrl', '/');
    });
    it('should support the CREATE action type', () => {
        const action = 'create';
        const data = {};
        const response = actionModel.performAction(action, data);

        expect(response).toBeDefined();
    });
    it('should support the SUBMIT action type', () => {
        const action = 'submit';
        const data = {};
        const response = actionModel.performAction(action, data);

        expect(response).toBeDefined();
    });
    it('should throw when passed unsupported action', () => {
       const action = 'unsupportedAction';
       const data = {};
       expect(() => {
           actionModel.performAction(action, data);
       }).toThrow();
    });
});