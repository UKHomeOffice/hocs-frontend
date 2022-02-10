import { infoService } from '../../clients';

jest.mock('../../clients', () => ({
    infoService: {
        get: jest.fn(() => Promise.resolve())
    }
}));

describe('get form fields for schema', () => {

    let req = {};
    let res = {};
    let next = jest.fn();

    beforeEach(() => {
        req = {};
        res = {};
        jest.resetAllMocks();
    });

    it('should get form fields for a given schema', async () => {
        req = {
            params: {
                schemaType: 'TEST_SCHEMA'
            },
            user: {
                id: 'test',
                roles: [],
                groups: []
            }
        };

        infoService.get.mockImplementation(() => Promise.resolve({ data: [{ uuid: '1234', component: 'testcomponent' }] }));
        const { getFieldsForSchema } = require('../schema');
        await getFieldsForSchema(req, res, next);
        expect(res.form).toBeDefined();
        expect(next).toHaveBeenCalled();
    });
});
