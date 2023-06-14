const router = require('express').Router();
const cookieParser = require('cookie-parser');
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware, sessionExpiryMiddleware } = require('../middleware/auth');
const apiRouter = require('./api/index');
const pageRouter = require('./page');
const actionRouter = require('./action');
const caseRouter = require('./case');
const documentRouter = require('./document');
const templatesRouter = require('./templates');
const healthRouter = require('./health');
const search = require('./search');
const dashboard = require('./dashboard');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');
const { protect } = require('../middleware/auth');
const { setCacheControl } = require('../middleware/cacheControl');
const { csrfMiddleware } = require('../middleware/csrf');
const { infoService } = require('../clients');
const logger = require('../libs/logger');
const { flush } = require('../services/list');
const passport = require("passport");
const OpenIDConnectStrategy = require('passport-openidconnect');
const OAuth2Strategy = require('passport-oauth2');
const OpenIdOAuth2Strategy = require("passport-openid-oauth20").Strategy;

html.use(assets);

console.log("AAA")
passport.use('oauth2', new OpenIdOAuth2Strategy({
            //issuer: 'https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod',
            authorizationURL: 'https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod/protocol/openid-connect/auth',
            tokenURL: 'https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod/protocol/openid-connect/token',
            //userInfoURL: 'https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod/protocol/openid-connect/userinfo',
            userProfileURL: 'https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod/protocol/openid-connect/userinfo',
            clientID: 'test-client',
            clientSecret: '',
            callbackURL: 'http://localhost:8080/',
            scope: [ 'profile' ]
        },
        function(token, tokenSecret, profile, done) {
            console.log("---1---")
            console.log(profile)
            console.log(token)
            console.log(tokenSecret)
            return done(null, profile)
        })
);
console.log("BBB")

router.use(cookieParser());
router.use(csrfMiddleware);
router.use('/health', healthRouter);
router.use('*',
    passport.authenticate('oauth2', { failureRedirect: '/login', failureMessage: true },
    function(req, res) {
        console.log("---2---")
        console.log(req)
        console.log(res)
        //res.redirect('http://localhost:9081/auth/realms/hocs/protocol/openid-connect/auth');
    }),
    sessionExpiryMiddleware,
    initRequest,
    setCacheControl
);

router.use('/', pageRouter);
router.use('/api', apiRouter);
router.use('/action', actionRouter);
router.use('/case', caseRouter);
router.use('/case', documentRouter);
router.use('/case', templatesRouter);
router.use('/', dashboard);
router.use('/', search);

router.get('/members/refresh',
    protect('REFRESH_MEMBERS'),
    async (req, res, next) => {
        try {
            await infoService.get('/admin/member/refresh');
            logger(req.requestId).info('REFRESH_MEMBERS', { user: req.user.email });
            res.status(200).send();
        } catch (error) {
            return next(error);
        }
    }
);

router.get('/admin/list/flush',
    protect('SYS_ADMIN'),
    (req, res, next) => {
        try {
            logger(req.requestId).info('FLUSH_CACHE', { user: req.user.email });
            flush('S_USERS');
            res.status(200).send();
        } catch (error) {
            return next(error);
        }
    }
);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;
