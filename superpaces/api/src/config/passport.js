var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy;

var sha1 = require('sha1');

var verifyHandler = function(token, tokenSecret, profile, done) {
    process.nextTick(function() {

        var filter = { uid: profile.id };
        /*if(profile.emails.length > 0){
          console.log(profile.emails[0]);
          filter = {email : profile.emails[0].value};
        }*/

        User.findOne(filter, function(err, user) {
            if (user) {
                return done(null, user);
            } else {

                var name = ""
                if (profile.displayName !== undefined && profile.displayName !== null && profile.displayName !== "") {
                    name = profile.displayName;
                } else if (profile.name && profile.name.givenName && profile.name.familyName) {
                    name = profile.name.givenName + ' ' + profile.name.familyName
                } else if (profile.name && profile.name.givenName) {
                    name = profile.name.givenName
                } else if (profile.name && profile.name.familyName) {
                    name = profile.name.familyName
                } else if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                    name = profile.emails[0].value
                }


                var data = {
                    provider: profile.provider,
                    uid: profile.id,
                    name: name
                };

                if (profile.emails && profile.emails[0] && profile.emails[0].value) {
                    data.email = profile.emails[0].value;
                }
                if (profile.name && profile.name.givenName) {
                    data.firstname = profile.name.givenName;
                }
                if (profile.name && profile.name.familyName) {
                    data.lastname = profile.name.familyName;
                }

                User.create(data, function(err, user) {
                    return done(err, user);
                });
            }
        });
    });
};

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id }, function(err, user) {
        done(err, user);
    });
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        process.nextTick(function() {
            User.findOne({ email: username, provider: 'local' }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (user.password !== sha1(password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });

    }
));


passport.use(new FacebookStrategy({
    clientID: "188958731513661",
    clientSecret: "4e313c2b85820efada264938d8ddc58d",
    callbackURL: "http://177.10.0.11:1337/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name'] //This
}, verifyHandler));


passport.use(new TwitterStrategy({
    consumerKey: 'JgNXvIt9ytmY4INgFjQRpRE1S',
    consumerSecret: 'XtZhxlwHomBwyZadjjoacpSoD3JTwqZXvNpbFpXNXmbhJbt3JH',
    callbackURL: 'http://177.10.0.11:1337/auth/twitter/callback',
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    profileFields: ['id', 'emails', 'name'] //This
}, verifyHandler));
