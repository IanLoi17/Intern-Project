const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home');
});


router.get('/signup', (req, res) => {
    res.render('user/signup');
});


router.get('/signin', (req, res) => {
    res.render('user/signin');
})


router.get('/signout', (req, res) => {
    req.logout();
    res.redirect('/signin');
})


module.exports = router;