var express = require('express');
var router = express.Router();
var passport = require('passport');
//var bcrypt = require('bcryptjs');

// Get Users model
var Admin = require('../models/admin');

/*
 * GET register
 */
router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Register'
    });

});

/*
 * POST register
 */
router.post('/register', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').isEmail();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Passwords do not match!').equals(password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Register'
        });
    } else {
        Admin.findOne({username: username}, function (err, admin) {
            if (err)
                console.log(err);

            if (admin) {
                req.flash('danger', 'Username exists, choose another!');
                res.redirect('/admin/register');
            } else {
                var admin = new Admin({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(admin.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        admin.password = hash;

                        admin.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered!');
                                res.redirect('/admin/login')
                            }
                        });
                    });
                });
            }
        });
    }

});

/*
 * GET login
 */
router.get('/login', function (req, res) {

    if (res.locals.admin) res.redirect('/');
    
    res.render('login', {
        title: 'Log in'
    });

});

/*
 * POST login
 */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
    
});

/*
 * GET logout
 */
router.get('/logout', function (req, res) {

    req.logout();
    
    req.flash('success', 'You are logged out!');
    res.redirect('/admin/login');

});

// Exports
module.exports = router;


