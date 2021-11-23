import User from '../user';

const testUser = new User({
    username: 'username',
    id: 'id',
    groups: 'A,B,C',
    roles: 'A,B,C',
    email: 'email'
});

const testUserNoGroupsOrRoles = new User({
    username: 'username',
    id: 'id',
    groups: null,
    roles: null,
    email: 'email'
});

describe('User Object', () => {
    it('should determine if user has a specific role', () => {
        expect(User.hasRole(testUser, 'A')).toEqual(true);
        expect(User.hasRole(testUser, 'D')).toEqual(false);
    });

    it('should determine if user has a specific group', () => {
        expect(User.hasGroup(testUser, 'A')).toEqual(true);
        expect(User.hasGroup(testUser, 'D')).toEqual(false);
    });

    it('should return a user with no groups or roles when none passed', () => {
        expect(testUserNoGroupsOrRoles.groups.length).toEqual(0);
        expect(testUserNoGroupsOrRoles.roles.length).toEqual(0);
    });
});