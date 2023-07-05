const passport = require('passport');
const { Issuer, Strategy } = require('openid-client');
const User = require('../models/user');
const { forContext } = require('../config');
const { cacheUserToken } = require("../middleware/userTokenCache");

const KeycloakClient = () => {
    let client;

    const getClient = async () => {
        if (client) {
            return client;
        }

        const { ISSUER, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = forContext('AUTH');

        const issuer = await Issuer.discover(ISSUER);

        client = new issuer.Client({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uris: [REDIRECT_URI],
        });

        return client;
    };

    return {
        getClient: getClient,
        configureStrategy: async () => {
            const client = await getClient();

            passport.use('keycloak', new Strategy({
                client: client,
                params: {
                    scope: 'openid'
                },
            }, (tokenset, userinfo, done) => {
                const user = new User(
                    {
                        uuid: userinfo.sub,
                        email: userinfo.email,
                        username: userinfo.preferred_username,
                        roles: userinfo.roles,
                        groups: userinfo.groups,
                    });

                // Pull the access token expiry, refresh token expiry and refresh token out of the tokenset
                user.tokenSet = {
                    accessTokenExpiry: tokenset.expires_at,
                    // TODO: we should look into using Luxon for this, as it's a bit more robust than the JS Date object
                    refreshTokenExpiry: Math.floor((new Date().getTime() / 1000) + tokenset.refresh_expires_in + 120),
                    refreshToken: tokenset.refresh_token
                };

                cacheUserToken(user)

                console.log("verify")
                console.log(user.tokenSet)

                return done(null, user);
            }));
        }

    };

};


module.exports = { KeycloakClient };
