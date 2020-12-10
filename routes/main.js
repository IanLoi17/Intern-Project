const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const title = "Welcome";

    res.render('home', {title: title});
});


router.get('/signup', (req, res) => {
    res.render('user/signup');
});


module.exports = router;