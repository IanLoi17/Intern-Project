const express = require('express');
const router = express.Router();
const User = require('../models/User');
const moment = require('moment');
const bcrypt= require('bcryptjs');
const ensureAuthenticated = require('../helpers/auth');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');
const Product = require('../models/Product');



router.post('/signup', (req, res) => {
    let errors = [];
    let strengthCheck = [];

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
            role,
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
                    role,
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
                        
                        if (email.includes("admin")) {
                            User.create({
                                name,
                                username,
                                role: "Administrator",
                                gender,
                                email,
                                DOB,
                                password
                            }).then(user => {
                                alertMessage(res, 'success', user.name + 'has registered successfully', 'fas fa-sign-in-alt', true);
                                res.redirect('/signin');
                            }).catch(err => console.log(err))
                        }
                        
                        else {
                            User.create({
                                name,
                                username,
                                role: "User",
                                gender,
                                email,
                                DOB,
                                password
                            }).then(user => {
                                alertMessage(res, 'success', user.name + 'has registered successfully', 'fas fa-sign-in-alt', true);
                                res.redirect('/signin');
                            }).catch(err => console.log(err))
                        }
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


router.get('/profile', (req, res) => {
    let id = req.user.id;

    User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        res.render('user/profile', {
            user
        });
    }).catch(err => console.log(err))
});


router.post('/updateProfile/:id', (req, res) => {
    let {name, email} = req.body;

    User.update({
        name,
        email
    }, {
        where: {
            id: req.params.id
        }
    }).then(() => {
        alertMessage(res, "success", "Your profile has been updated successfully", "fa fa-check", true);
        res.redirect("/");
    }).catch(err => console.log(err));
});



router.get('/changePassword', (req, res) => {
    res.render('./user/changePassword');
});



router.post('/changePassword', (req, res) => {
    let {password, newPass, confirmNewPass} = req.body;

    User.findOne({
        where: {
            id: req.params.id
        }
    }).then((user) => {

    })
})

router.get('/Product', (req, res) => {
    Product.findAll().then((products) => {
        res.render('./user/Product', {
            products
        })
    })
})

router.get('/ProductDetails/:id', (req, res) => {
    Product.findOne({
        where: {
            id: req.params.id
        }
    }).then((product) => {
        res.render('./user/ProductDetails', {
            product
        });
    }).catch(err => console.log(err));
});



module.exports = router;