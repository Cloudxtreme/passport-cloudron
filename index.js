var util = require('util'),
    superagent = require('superagent'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;

// Allow self signed certs!
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function Strategy(options, verify) {
    options = options || {};
    options.apiOrigin = options.apiOrigin || process.env.API_ORIGIN;

    options.authorizationURL = options.authorizationURL || options.apiOrigin + '/api/v1/oauth/dialog/authorize';
    options.tokenURL = options.tokenURL || options.apiOrigin + '/api/v1/oauth/token';
    options.scopeSeparator = ',';

    options.clientID = options.clientID || process.env.OAUTH_CLIENT_ID;
    options.clientSecret = options.clientSecret || process.env.OAUTH_CLIENT_SECRET;

    OAuth2Strategy.call(this, options, verify);
    this.name = 'cloudron';
    this._profileUrl = options.apiOrigin + '/api/v1/profile';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
    superagent.get(this._profileUrl).query({ access_token: accessToken }).end(function (error, result) {
        if (error) return done(new InternalOAuthError('failed to fetch user profile', error));
        if (result.statusCode !== 200) return done(new InternalOAuthError('failed to fetch user profile', result.statusCode));
        done(null, result.body);
    });
};

module.exports = Strategy;
