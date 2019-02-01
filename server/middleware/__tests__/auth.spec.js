import { authMiddleware, protect } from '../auth';
import User from '../../models/user';

const mockHeaders = {
    'X-Auth-Token': 'token',
    'X-Auth-Username': 'Test User',
    'X-Auth-UserId': 'userId',
    'X-Auth-Groups': '',
    'X-Auth-Roles': 'CASE_CREATE,BULK_CASE_CREATE,DCU',
    'X-Auth-Email': 'test@email.com'
};
let req = null;
let res = null;

describe('Authentication middleware', () => {

    const next = jest.fn();

    beforeEach(() => {
        req = {
            get: (header) => {
                return mockHeaders[header];
            }
        };
        res = {};
        next.mockReset();
    });

    it('should call next with error when no X-Auth-Token', () => {
        req.get = () => {
        };
        authMiddleware(req, res, next);
        expect(req.user).toBeUndefined();
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(next.mock.calls[0][0].status).toEqual(401);
    });

    it('should create and attach a User object to the request object', () => {
        authMiddleware(req, res, () => {
            expect(req.user).toBeDefined();
            expect(req.user.username).toEqual(mockHeaders['X-Auth-Username']);
            expect(req.user.id).toEqual(mockHeaders['X-Auth-UserId']);
            expect(req.user.email).toEqual(mockHeaders['X-Auth-Email']);
            expect(req.user.roles).toBeInstanceOf(Array);
            expect(req.user.roles).toEqual(mockHeaders['X-Auth-Roles'].split(','));
            expect(req.user.groups).toBeInstanceOf(Array);
            expect(req.user.groups).toEqual([]);
        });
    });

    it('should not recreate the user object if exists', () => {
        req.user = 'TEST';
        authMiddleware(req, res, () => {
            expect(req.user).toBeDefined();
            expect(req.user).toEqual('TEST');
        });
    });

});

describe('Protect middleware', () => {

    const next = jest.fn();

    beforeEach(() => {
        req = {
            user: new User({
                roles: 'TEST_ROLE'
            })
        };
        res = {};
        next.mockReset();
    });

    it('should call next when required role is on the user object', () => {
        const protectMiddleware = protect('TEST_ROLE');
        protectMiddleware(req, res, () => {
            expect(req.error).toBeUndefined();
        });
    });

    it('should create an instance of the Error model on the request object when required role is missing', () => {
        const protectMiddleware = protect('SOME_UNDEFINED_ROLE');
        protectMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
        expect(next.mock.calls[0][0].status).toEqual(403);
    });

});