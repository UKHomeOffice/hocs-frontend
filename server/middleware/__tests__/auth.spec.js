import { buildUserModel } from '../auth';

const mockHeaders = {
    'X-Auth-Token': 'token',
    'X-Auth-Username': 'Test User',
    'X-Auth-UserId': 'userId',
    'X-Auth-Groups': '',
    'X-Auth-Roles': 'CASE_CREATE,BULK_CASE_CREATE,DCU',
    'X-Auth-Email': 'test@email.com'
};
let req = null;
const res = {
};

describe('Authentication middleware', () => {

    beforeEach(() => {
        req = {
            get: (header) => {
                return mockHeaders[header];
            }
        };
    });

    it('should redirect when no X-Auth-Token', () => {
        req.get = () => {
        };
        buildUserModel(req, res, () => {
            expect(req.user).toBeUndefined();
            expect(req.error).toBeDefined();
            expect(req.error.errorCode).toEqual(403);
            expect(req.error.title).toEqual('Unauthorised');
        });
    });

    it('should create and attach a User object to the request object', () => {
        buildUserModel(req, res, () => {
            expect(req.user).toBeDefined();
            expect(req.user.token).toEqual(mockHeaders['X-Auth-Token']);
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
        buildUserModel(req, res, () => {
            expect(req.user).toBeDefined();
            expect(req.user).toEqual('TEST');
        });
    });

    it('should not redirect if already at unauthorised page', () => {
        req.get = () => { };
        req.originalUrl = '/unauthorised';
        buildUserModel(req, res, () => {
            expect(req.user).toBeUndefined();
        });
    });
});