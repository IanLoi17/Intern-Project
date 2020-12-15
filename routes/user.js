const express = require('express');
const router = express.Router();
const User = require('../models/User');
const moment = require('moment');
const bcrypt= require('bcryptjs');
const ensureAuthenticated = require('../helpers/auth');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');



router.post('/signup', (req, res) => {
    let errors = [];

    let {name, username, gender, email, password, cpassword} = req.body;
    let DOB = moment(req.body.DOB, 'DD/MM/YYYY');
    let userID = req.body.userID;

    if (req.body.password.length < 8) {
        errors.push({text: 'Passwords must be at least 8 characters'});
    }

    if (req.body.password !== req.body.cpassword) {
        errors.push({text: 'Both passwords do not match'});
    }

    if (errors.length > 0) {
        res.render('user/signup', {
            errors,
            name,
            username,
            gender,
            email,
            DOB,
            password,
            cpassword
        });
    }


    else {
        User.findOne({
            where: {username: req.body.username}
        }).then((user) => {
            if (user) {
                res.render('user/signup', {
                    name,
                    username,
                    email,
                    gender,
                    DOB,
                    password,
                    cpassword
                })

                alertMessage(res, 'danger', 'A user with email ' + user.email + 'has already registered an account! Use another email', 'fa fa-warning', true);
            }

            else {
                password = req.body.password;
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
                        password = bcrypt.hashSync(password, salt);

                        User.create({
                            name,
                            username,
                            gender,
                            email,
                            DOB,
                            password
                        }).then(user => {
                            alertMessage(res, 'success', user.name + 'has registered successfully', 'fas fa-sign-in-alt', true);
                            res.redirect('/signin');
                        }).catch(err => console.log(err))
                    })
                })
            }
        })
    }
});


router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});





module.exports = router;