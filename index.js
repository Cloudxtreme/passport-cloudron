var util = require('util'),
    superagent = require('superagent'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;

// Allow self signed certs!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || process.env.ADMIN_ORIGIN + '/api/v1/oauth/dialog/authorize';
    options.tokenURL = options.tokenURL || process.env.ADMIN_ORIGIN + '/api/v1/oauth/token';
    options.scopeSeparator = options.scopeSeparator || ',';
    options.clientID = options.clientID || process.env.OAUTH_CLIENT_ID;
    options.clientSecret = options.clientSecret || process.env.OAUTH_CLIENT_SECRET;

    OAuth2Strategy.call(this, options, verify);
    this.name = 'cloudron';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
    superagent.get(apiOrigin + '/api/v1/profile').query({ access_token: req.session.token }).end(function (error, result) {
        if (error) return done(new InternalOAuthError('failed to fetch user profile', error));
        if (result.status !== 200) done(new InternalOAuthError('failed to fetch user profile', result.status));

        done(null, result.body);
    });
};

module.exports = Strategy;
