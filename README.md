# passport-cloudron

[Passport](http://passportjs.org/) strategy for authenticating with [Cloudron](https://cloudron.io/) using the OAuth API.

This module lets you authenticate using a Cloudron in your Node.js applications through the [Passport](http://passportjs.org/) library.

## Install

```
$ npm install passport-cloudron
```

## Usage

```
var CloudronStrategy = require('passport-cloudron');
```

#### Configure Strategy

The Cloudron authentication strategy authenticates users using a Cloudron account
and OAuth tokens.  The strategy requires a `verify` callback, which receives the
access token and corresponding secret as arguments, as well as `profile` which
contains the authenticated user's Cloudron profile.   The `verify` callback must
call `done` providing a user to complete authentication.

In order to identify your application to the Cloudron, specify the clientID and 
clientSecret within `options`. These values are picked up automatically from the
environment variables when using the `oauth` addon, so usually you don't have to provide
them explicitly. See the [addon documentation page](https://cloudron.io/references/addons.html#oauth)
for more information.

```javascript
passport.use(new CloudronStrategy({
    callbackURL: process.env.APP_ORIGIN + '/auth/done'
  },
  function verify(token, tokenSecret, profile, done) {
    User.findOrCreate({ id: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'cloudron'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/cloudron',
    passport.authenticate('cloudron'));

app.get('/auth/cloudron/callback',
  passport.authenticate('cloudron', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```
