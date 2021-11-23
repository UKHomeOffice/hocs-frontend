import * as Actions from '../index.jsx';
import ActionTypes from '../types.jsx';

describe('Actions', () => {
    it('should only export functions that return actions objects', () => {
        Object.keys(Actions).map(action => {
            expect(typeof Actions[action]).toEqual('function');
            const ActionObject = Actions[action].call(this);
            expect(ActionObject).toBeDefined();
            expect(ActionObject.type).toBeDefined();
            expect(ActionTypes[ActionObject.type]).toBeDefined();
        });
    });
});