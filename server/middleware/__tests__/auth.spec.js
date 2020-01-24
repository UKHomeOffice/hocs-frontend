import { authMiddleware, protect, sessionExpiryMiddleware } from '../auth';
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
            cookies: {},
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

describe('When the session expiry middleware is called', () => {
    const next = jest.fn();
    const mockSetHeader = jest.fn();
    const OLD_ENV = process.env;
    const mockGetHeaders = jest.fn(() => 'Wed, 15th Jan 2020 10:59:55 GMT');

    beforeEach(() => {
        req = {
            cookies: {
                'kc-state': '7xiGVmRyhji3oYt82R7L55w44sKRSQ+cPioJHtkBFCm3zezAA0Y3wslt+gJKuMpzCZXOaL8S5x/uFKWE5hGwf3y339OOEjrXaOWlQgBMogpDDp2fTOufar4LENtVjcy7VspNx+0XPptKqLZJvL1XBCgOMl3NSvvWGo78x/7vPsaI6GW7rY5+kpm9UKMoiG6sLHcZSyrkkKrzeCqz0xW58yqA8cemSgl+txqYOxbQGhGiDCm278LkWwM71w9+rE+v22cD/azHP31naL/LJUluJlEo52MBWDgiqdDxJgeBDnhrTUkUNcbe266qTFF7oTd2M/x8+P6LmJlEIWy+pu+buMUvLy+u0dq1YQtUuMn9tVdjQ80TtzIJPahSoGbfMDWce0nLV++JLjdBi1WoU+j3PwDINPuf8q0JcFGd5Vy7kHw/OLaLuC7i6P2/MJ1GyNeXf117mYJqKdWTGQtuC1/oFIVKwJIHaPUA6IgkRuPSEoqeIhRf0PBxylpksbhX3HkydljvvRz3DSpt/OtCx+/nijtJdWzt2kSqhLj/kPEV/hb6cHK1dGXSPVZiZ8iEOjIFRYaShepthS/T2EGt17pxGEwNaV1uYbcVMnoTYCFQNrka89ciX+I358+T3aVmsGMvxR7ApGY50LU9TwQ6OLYJxrAkjq0Lrb3rGY9/NFbCWVeN1+6j+3NXST6CQOUQCtSiHxQP/jgwoZI/pWSMViSaxBG8IdBC4bEfVqeaGRNmNWHGT50wuzfspgL7vcw3D4g5/ciDPI2hHqfP2HNXtVQQnVbFlDvMnS3fYsLKGaJeU6L7DpQJaMnK3ddn5HPPzBI2hjhsDlMaPi7MHIx+O2NSKqPHT2CiFc59jhi92kq5hkBxNDfy9n2ezFRtjKwhs7qjjjOh7BsWjtV11zqw'
            },
            get: mockGetHeaders
        };
        res = {
            _headers: {},
            setHeader: mockSetHeader,
            get: mockGetHeaders
        };
        next.mockReset();
        jest.resetModules();
        process.env = { ...OLD_ENV };
        delete process.env.ENCRYPTION_KEY;
        mockSetHeader.mockReset();
    });

    describe('and the state cookie is present', () => {

        describe('and the cookie can be decrypted', () => {
            beforeEach(() => {
                process.env.ENCRYPTION_KEY = 'abcdabcdabcdabcdabcdabcdabcdabcd';
                sessionExpiryMiddleware(req, res, next);
            });

            it('should set the refresh token expiry time in the header', () => {
                expect(mockSetHeader).toHaveBeenCalledWith('X-Auth-Session-ExpiresAt', 'Sat, 01 Feb 2014 00:27:30 GMT');
            });

            it('should call the next handler', () => {
                expect(next).toHaveBeenCalled();
            });
        });

        describe('and the cookie can not be decrypted', () => {
            beforeEach(() => {
                process.env.ENCRYPTION_KEY = 'abcdabcdabcdabcdabcdabcdabcdabce';
                sessionExpiryMiddleware(req, res, next);
            });

            it('should set the access token expiry time in the header', () => {
                expect(mockSetHeader).toHaveBeenCalledWith('X-Auth-Session-ExpiresAt', 'Wed, 15th Jan 2020 10:59:55 GMT');
            });
            it('should call the next handler', () => {
                expect(next).toHaveBeenCalled();
            });
        });

    });
    describe('and the state cookie is not present', () => {
        beforeEach(() => {
            req.cookies = {};
            sessionExpiryMiddleware(req, res, next);
        });

        describe('and the access token expiry header is present', () => {
            it('should set the access token expiry time in the header', () => {
                expect(mockSetHeader).toHaveBeenCalledWith('X-Auth-Session-ExpiresAt', 'Wed, 15th Jan 2020 10:59:55 GMT');
            });
            it('should call the next handler', () => {
                expect(next).toHaveBeenCalled();
            });
        });
        describe('and the access token expiry header is NOT present', () => {
            beforeAll(() => {
                mockGetHeaders.mockReturnValue(undefined);
            });
            beforeEach(() => {
                sessionExpiryMiddleware(req, res, next);
            });
            it('should set the access token expiry time in the header', () => {
                expect(mockSetHeader).not.toHaveBeenCalled();
            });
            it('should call the next handler', () => {
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
