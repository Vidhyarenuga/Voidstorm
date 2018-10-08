
var passport = require('passport');
var passportConf = require('../config/passport');
var Course = require('../models/course');
var User = require('../models/user');

module.exports = function(app) {

  app.get('/login', function(req, res, next) {
    res.render('accounts/login');
  });

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));


 
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/create-userprofile',
    failureRedirect: '/login'
  }));
  
  
  app.get('/auth/google', passport.authenticate('google', { scope: 'email'}));
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/create-userprofile',
    failureRedirect: '/login'
  }));


  app.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });


  app.get('/profile', function(req, res, next) {
    Course.find({}, function(err, courses) {
       
       res.render('accounts/profile', {courses: courses ,message: req.flash('loginMessage')});
    });
   
  });
  


}
