const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

function localStrategy(passport) {
    passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
        User.findOne({where: {username: username}})
            .then(user => {
                if (!user) {
                    return done(null, false, {message: 'No User Found!'});
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    }

                    else {
                        return done(null, false, {message: 'Incorrect Password!'})
                    }
                })
            })
    }));

    // Serializes (stores) user id into session upon successful authentication
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // User object is retrieved by userId from session and put into req.user
    passport.deserializeUser((userId, done) => {
        User.findByPk(userId)
            .then((user) => {
                done(null, user);   // user object saved in req.session
            })
            .catch((done) => {      // No user found, not stored in req.session
                console.log(done);
            });
    });


    // passport.use(new RememberMeStrategy(
    //     function(token, done) {
    //         Token.consume(token, function (err, user) {
    //             if (err) {
    //                 return done(err);
    //             }

    //             if (!user) {
    //                 return done(null, false);
    //             }
    //         });
    //     },

    //     function(user, done) {
    //         var token = utils.generateToken(64);
    //         Token.save(token, {
    //             userId: user.id
    //         }, 
    //         function(err) {
    //             if (err) {
    //                 return done(err);
    //             }

    //             return done(null, token);
    //         });
    //     }
    // ));
}

module.exports = {localStrategy};