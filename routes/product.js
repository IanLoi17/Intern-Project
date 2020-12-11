const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/ProductAdmin', (req, res) => {
    res.render('admin/ProductAdmin');
});

router.get('/ProductAdminInsert', (req, res) => {
    res.render('admin/ProductAdminInsert');
});

// router.post('/ProductAdmin', (req, res) => {
//     // res.render('admin/ProductAdmin');
// });

router.post('/ProductAdminInsert', (req,res)=>{
    let ProductName = req.body.ProductName;
    let ProductType = req.body.ProductType;
    let ProductDesc = req.body.ProductDesc;
    let ProductQuantity = req.body.ProductQuantity;
    let ProductImage = req.body.ProductImage;
    let ProductPrice = req.body.ProductPrice;
    let userId = 1;

    Product.create({
        ProductName,
        ProductQuantity,
        ProductImage,
        ProductDesc,
        ProductPrice,
        ProductType,
        userId  
    }).then((product) => {
        res.redirect('./ProductAdmin')
    }).catch(err => console.log(err));
});

router.post('/upload', function(req, res) {
    console.log(req.files.productimage); // the uploaded file object
  });

module.exports = router;