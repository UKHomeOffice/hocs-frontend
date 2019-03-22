const usersAdapter = require('../users');

describe('User Adapter', () => {

    it('should transform and sort user data', async () => {
        const mockData = [
            { firstName: 'User', lastName: 'A', email: 'user.a@test.com', id: 1 },
            { firstName: 'User', lastName: 'C', email: 'user.c@test.com', id: 3 },
            { firstName: 'User', lastName: 'B', email: 'user.b@test.com', id: 2 }
        ];

        const results = await usersAdapter(mockData, { user: { id: 1 } });

        expect(results).toBeDefined();
        expect(results).toMatchSnapshot();
    });
});