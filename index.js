const express = require('express');
const path = require('path');
const applicationRouter = require('./server/routes/index');
const logger = require('./server/libs/logger');
const listService = require('./server/services/list');
const listConfiguration = require('./server/lists');
const passport = require('passport');
const session = require('express-session');
const { KeycloakClient } = require('./server/libs/auth');
const { isProduction } = require('./server/config');
const { getCachedUserToken, cacheUserToken } = require('./server/middleware/userTokenCache')

const app = express();
const port = process.env.PORT || 8080;

app.use('/public/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')));
app.use('/public', express.static(path.join(__dirname, 'build', 'public'), { maxAge: 36000000 }));

//TODO: This wouldn't work in a clustered environment as the session would be lost across pods,
//      we need to use a shared session store like redis.
app.use(session({
    //TODO: This needs to be changed to a secure key
    secret: '',
    resave: false,
    saveUninitialized: false,
    //TODO: This should also set an applicable maxAge
    cookie: {
        secure: isProduction,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

KeycloakClient().configureStrategy();

passport.serializeUser(async (req, user, done) => {
    console.log("serializeUser")
    user.tokenSet = await getCachedUserToken(user.uuid)
    console.log(user.tokenSet)
    done(null, user);
});

passport.deserializeUser(async (req, user, done) => {
    console.log("deserializeUser")

    const serializedTokenSet = await getCachedUserToken(user.uuid)

    const userDetails = serializedTokenSet !== null ? serializedTokenSet : await cacheUserToken(user)

    user.tokenSet = userDetails.tokenSet
    console.log(user.tokenSet)
    done(null, user);
});

app.use('/', applicationRouter);

listService.initialise(listConfiguration.lists, listConfiguration.clients);

app.listen(port, () => {
    logger().debug('SERVER_START', { port });
});
