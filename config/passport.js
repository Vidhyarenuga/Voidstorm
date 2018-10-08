
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var secret = require('../config/secret');
var async = require('async');
var request = require('request');
var bcrypt=require('bcryptjs');

var User = require('../models/user');
var Admin=require('../models/admin');


module.exports = function (passport) {

    passport.use(new LocalStrategy(function (username, password, done) {

        Admin.findOne({username: username}, function (err, admin) {
            if (err)
                console.log(err);

            if (!admin) {
                return done(null, false, {message: 'No user found!'});
            }

            bcrypt.compare(password, admin.password, function (err, isMatch) {
                if (err)
                    console.log(err);

                if (isMatch) {
                    return done(null, admin);
                } else {
                    return done(null, false, {message: 'Wrong password.'});
                }
            });
        });

    }));

    passport.serializeUser(function (admin, done) {
        done(null, admin.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, admin) {
            done(err, admin);
        });
    });

}




//----------Function to serialize the userid in the session----------
passport.serializeUser(function(user, done) {
  done(null, user._id);
});


//---------Function to desearlize the userid from the session to access the mongodb-------------
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//-----------Middleware of facebook stratergy for the users to login----------
passport.use(new FacebookStrategy(secret.facebook, function(req, token, refreshToken, profile, done) {
  User.findOne({ facebook: profile.id }, function(err, user) {
    if (err) return done(err);
    //---------Displaying the flash message when the user logs in again by collecting the data from the session-----
    if (user) {
      req.flash('loginMessage', 'Successfully login with facebook');
      return done(null, user);
    } else {

      
      async.waterfall([
        function(callback) {
          var newUser = new User();
          newUser.email = profile._json.email;
          newUser.facebook = profile.id;
          newUser.tokens.push({ kind: 'facebook', token: token });
          newUser.profile.name = profile.displayName;
          newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          newUser.profile.gender=profile.gender;

          //---------Saving the user when logged in for the first time-------------
          newUser.save(function(err) {
            if (err) throw err;
            req.flash('loginMessage', 'Successfully login with facebook');
            callback(err, newUser)
          });
        },
        //--------After the user logins for the first time keep his email id in the mailchimp
        function(newUser, callback) {
          //Mailchimp request
          request({
            url: 'https://us18.api.mailchimp.com/3.0/lists/82c6b4e15b/members',
            method: 'POST',
            headers: {
              'Authorization':'randomUser 8b0e5b6d59e415447de9417b8cce0f03-us18',
              'Content-Type': 'application/json'
            },
            json: {
              'email_address': newUser.email,
              'status': 'subscribed'
            }

          }, function(err, response, body) {
            
            if (err) {
              return done(err, newUser);
            } else {
              console.log("Success");
              return done(null, newUser);
            }
          });
        }
      ]);

    }
  });
}));

//google oauth
//-----------Middleware of facebook stratergy for the users to login----------
passport.use(new GoogleStrategy(secret.google, function(req, token, refreshToken, profile, done) {
  User.findOne({ google: profile.id }, function(err, user) {
    if (err) return done(err);
    //---------Displaying the flash message when the user logs in again by collecting the data from the session-----
    if (user) {
      req.flash('loginMessage', 'Successfully login with google');
      return done(null, user);
    } else {

      
      async.waterfall([
        function(callback) {
          
          var newUser = new User();
          newUser.email = profile._json.emails[0].value;
          newUser.google= profile.id;
          newUser.tokens.push({ kind: 'google', token: token });
          newUser.profile.name = profile.displayName;
          newUser.profile.picture = profile._json.image.url;
          newUser.profile.picture = profile.photos[0].value,'?sz=250';
           newUser.profile.gender=person.getGender();

          //---------Saving the user when logged in for the first time-------------
          newUser.save(function(err) {
            if (err) throw err;
            //req.flash('loginMessage', 'Successfully login with google');
            callback(err, newUser)
          });
        },
        //--------After the user logins for the first time keep his email id in the mailchimp
        function(newUser, callback) {
          //Mailchimp request
          request({
            url: 'https://us18.api.mailchimp.com/3.0/lists/82c6b4e15b/members',
            method: 'POST',
            headers: {
              'Authorization':'randomUser 8b0e5b6d59e415447de9417b8cce0f03-us18',
              'Content-Type': 'application/json'
            },
            json: {
              'email_address': newUser.email,
              'status': 'subscribed'
            }

          }, function(err, response, body) {
            
            if (err) {
              return done(err, newUser);
            } else {
              console.log("Success");
              return done(null, newUser);
            }
          });
        }
      ]);

    }
  });
}));


