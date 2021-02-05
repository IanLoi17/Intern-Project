const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const moment = require('moment');
const bcrypt= require('bcryptjs');
const ensureAuthenticated = require('../helpers/auth');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Cryptr = require('cryptr');
cryptr = new Cryptr('devnami');
const alertMessage = require('../helpers/messenger');
const fs = require('fs');
const upload = require('../helpers/imageUpload');



router.post('/signup', (req, res) => {
    let errors = [];

    let {name, username, gender, email, password, cpassword} = req.body;
    let DOB = moment(req.body.DOB, 'DD/MM/YYYY');
    let signupDate = moment(req.body.signupDate, 'DD/MM/YYYY HH:mm:ss')
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

                alertMessage(res, 'danger', 'A user with the username ' + user.username + ' has already registered an account! Use another username', 'fa fa-warning', true);
            }

            else {
                // password = cryptr.encrypt(req.body.password);

                // if (email.includes("admin")) {
                //     User.create({
                //         name,
                //         username,
                //         role: "Administrator",
                //         gender,
                //         email,
                //         DOB,
                //         password,
                //         verified: 0
                //     }).then(user => {
                //         alertMessage(res, 'success', user.name + ' has registered successfully', 'fas fa-sign-in-alt', true);
                //         res.redirect('/signin');
                //     }).catch(err => console.log(err))
                // }
                
                // else {
                //     User.create({
                //         name,
                //         username,
                //         role: "User",
                //         gender,
                //         email,
                //         DOB,
                //         password,
                //         verified: 0
                //     }).then(user => {
                //         alertMessage(res, 'success', user.name + ' has registered successfully', 'fas fa-sign-in-alt', true);
                //         res.redirect('/signin');
                //     }).catch(err => console.log(err))
                // }
                
                // let token;
                // jwt.sign(email, 's3cr3Tk3y', (err, jwtoken) => {
                //     if (err) {
                //         console.log('Error generating Token: ' + err);
                //     }

                //     token = jwtoken;
                // })

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
                                password,
                                signupDate,
                                verified: 0
                            }).then(user => {
                                alertMessage(res, 'success', user.name + ' has registered successfully', 'fas fa-sign-in-alt', true);
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
                                password,
                                signupDate,
                                verified: 0
                            }).then(user => {
                                alertMessage(res, 'success', user.name + ' has registered successfully', 'fas fa-sign-in-alt', true);
                                res.redirect('/signin');
                            }).catch(err => console.log(err))
                        }
                    });
                });
            }
        });
    }
});


router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next);
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
    let {name, imageURL, email} = req.body;

    User.update({
        name,
        profileImgURL: imageURL,
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




router.get('/resetPassword', (req, res) => {
    res.render('./user/resetPassword');
});



router.post('/resetPassword', (req, res) => {
    let {email} = req.body;

    function sendEmail(userId, email) {
        sgMail.setApiKey("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");

        const message = {
            to: email,
            from: 'Do Not Reply <admin@E-Commerce.sg>',
            subject: 'Password reset for your account',
            text: 'E-Commerce email password reset',
            html: `Request of password reset<br><br>Please click <a href="http://localhost:5000/user/resetPass/${userId}"><strong>here</strong></a> to reset your password.`
        };

        sgMail.send(message);

        // return new Promise((resolve, reject) => {
        //     sgMail.send(message).then(msg => resolve(msg)).catch(err => reject(err));
        // });
    }

    User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        sendEmail(user.id, user.email).then(msg => {
            alertMessage(res, 'success', user.name + ' has requested for a password reset. Please login to ' + user.email + ' to reset your password.', 'fas fa-sign-in-alt', true);
            res.redirect('/signin');
        }).catch(err => {
            console.log(err);
            alertMessage(res, 'danger', 'Error sending to ' + user.email, 'fa fa-warning', true);
            res.redirect('/');
        });
    }).catch(err => console.log(err));
});


router.get('/resetPass/:userId', (req, res, next) => {
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        
    })
})





router.get('/changePassword', (req, res) => {
    res.render('./user/changePassword');
});


router.post('/changePassword', (req, res) => {
    let {oldPass, newPass, confirmNewPass} = req.body;
    let id = req.user.id;
    //let currentPass = req.user.password;


    // let decryptPass = cryptr.decrypt(currentPass);
    // console.log(decryptPass);

    // if (oldPass == decryptPass) {
    //     let newPassword = cryptr.encrypt(newPass);

    //     User.update({
    //         password: newPassword
    //     }, {
    //         where: {
    //             id: id
    //         }
    //     }).then(() => {
    //         alertMessage(res, "success", "Your password has been changed successfully. Please sign in with your new password", "fa fa-check", true);
    //         res.redirect("/signout");
    //     }).catch(err => console.log(err));
    // }

    // else {
    //     alertMessage(res, "danger", "Your current password does not match your the password you entered. Try again", "fa fa-exclamation-circle", true);
    //     res.redirect("/user/changePassword");
    // }


    

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("B4c0/\/", salt, function(err, hash) {
            newPass = bcrypt.hashSync(newPass, salt);

            User.update({
                password: newPass
            }, {
                where: {
                    id: id
                }
            }).then(() => {
                alertMessage(res, "success", "Your password has been changed successfully. Please sign in with your new password", "fa fa-check", true);
                res.redirect("/signout");
            }).catch(err => console.log(err));
        })
    })
});



router.post('/upload', ensureAuthenticated, (req, res) => {
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }


    upload(req, res, (err) => {
        if (err) {
            res.json({
                file: '/images/no-image.jpg', 
                err: err
            });

            console.log(err);
        }


        else {
            if (req.file === undefined) {
                res.json({
                    file: '/images/no-image.jpg',
                    err: err
                });

                console.log(err);
            }

            else {
                res.json({
                    file: `/uploads/${req.user.id}/${req.file.filename}`
                });
            }
        }
    });
});


router.get('/Product', (req, res) => {
    Product.findAll().then((products) => {
        res.render('./user/Product', {
            products
        });
    }).catch(err => console.log(err));
});



router.get('/productDetails/:id', (req, res) => {
    let id = req.params.id;


    Product.findOne({
        where: {
            id: id
        }
    }).then(product => {
        res.render('./user/ProductDetails', {
            product
        });
    }).catch(err => console.log(err));
});





module.exports = router;