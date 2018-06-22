import authenticationMiddleware from "../auth";

const mockRedirect = jest.fn();
const mockHeaders = {
    'X-Auth-Token': 'token',
    'X-Auth-Username': 'username',
    'X-Auth-UserId': 'userId',
    'X-Auth-Groups': '',
    'X-Auth-Roles': 'CREATE,DCU,FOI',
    'X-Auth-Email': 'test@email.com'
};
let mockRequest = null;
const mockResponse = {
    redirect: mockRedirect
};

describe('Authentication middleware', () => {

    beforeEach(() => {
        mockRedirect.mockReset();
        mockRequest = {
            get: (header) => {
                return mockHeaders[header]
            }
        };
    });

    it('should redirect when no X-Auth-Token', () => {
        mockRequest.get = () => {
        };
        authenticationMiddleware(mockRequest, mockResponse, () => {
            expect(mockRequest.user).toBeUndefined();
            expect(mockRedirect).toHaveBeenCalledTimes(1);
            expect(mockRedirect).toHaveBeenCalledWith('/unauthorised');
        });
    });

    it('should create and attach a User object to the request object', () => {
        authenticationMiddleware(mockRequest, mockResponse, () => {
            expect(mockRequest.user).toBeDefined();
            expect(mockRequest.user.token).toEqual(mockHeaders['X-Auth-Token']);
            expect(mockRequest.user.username).toEqual(mockHeaders['X-Auth-Username']);
            expect(mockRequest.user.id).toEqual(mockHeaders['X-Auth-UserId']);
            expect(mockRequest.user.email).toEqual(mockHeaders['X-Auth-Email']);
            expect(mockRequest.user.roles).toBeInstanceOf(Array);
            expect(mockRequest.user.roles).toEqual(mockHeaders['X-Auth-Roles'].split(','));
            expect(mockRequest.user.groups).toBeInstanceOf(Array);
            expect(mockRequest.user.groups).toEqual([]);
        });
    });

    it('should not recreate the user object if exists', () => {
        mockRequest.user = "TEST";
        authenticationMiddleware(mockRequest, mockResponse, () => {
            expect(mockRequest.user).toBeDefined();
            expect(mockRequest.user).toEqual('TEST');
        });
    });

    it('should not redirect if already at unauthorised page', () => {
        mockRequest.get = () => {};
        mockRequest.originalUrl = '/unauthorised';
        authenticationMiddleware(mockRequest, mockResponse, () => {
            expect(mockRequest.user).toBeUndefined();
            expect(mockRedirect).toHaveBeenCalledTimes(0);
        })
    });
});