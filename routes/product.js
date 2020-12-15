const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const alertMessage = require('../helpers/messenger');
const User = require('../models/User');



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
        res.redirect('/product/addProductAdmin');
    }).catch(err => console.log(err));
});


module.exports = router;
