const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');

router.get('/addProductAdmin', (req, res) => {
    Product.findAll({
        where: {}
    }).then((products) => {
        res.render('./admins/addProductAdmin', {
            products
        });
    }).catch(err => console.log(err));
});


router.post('/addProductAdmin', (req, res) => {
    let {ProductName, ProductType, ProductDesc, ProductQuantity, ProductImage, ProductPrice} = req.body;
    let userId = req.user.id;

    Product.create({
        ProductName,
        ProductQuantity,
        ProductImage,
        ProductDesc,
        ProductPrice,
        ProductType,
        userId
    }).then(() => {
        alertMessage(res, 'success', 'Product has been added successfully', 'fa fa-check-circle', true);
        res.redirect('/admins/addProductAdmin');
    }).catch(err => console.log(err));
});



router.get('/adminUsersView', ensureAuthenticated, (req, res) => {
    User.findAll({
        order: [
            ['name', 'ASC']
        ],
        
        raw: true
    }).then((users) => {
        res.render('./admins/adminUsersView', {
            users: users
        });
    }).catch(err => console.log(err));
});



module.exports = router;
