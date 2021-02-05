const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/productUpload');

router.get('/addProductAdmin/:id', (req, res) => {
    let id = req.params.id;
    
    // Product.findAll({
    //     where: {}
    // }).then((products) => {
    //     res.render('./admins/addProductAdmin', {
    //         products
    //     });
    // }).catch(err => console.log(err));
    Inventory.findOne({
        where: {
            id: id
        }
    }).then(inventory => {
        res.render('./admins/addProductAdmin', {
            inventory
        });
    }).catch(err => console.log(err));
});



router.post('/addProductAdmin', (req, res) => {
    let {ProductName, ProductType, ProductDesc, ProductQuantity, productImgURL, ProductSellingPrice} = req.body;
    let userId = req.user.id;

    console.log(productImgURL);

    Product.create({
        ProductName,
        ProductQuantity,
        ProductImage: productImgURL,
        ProductDesc,
        ProductSellingPrice,
        ProductType,
        userId
    }).then(() => {
        alertMessage(res, 'success', 'Product has been added successfully', 'fa fa-check-circle', true);
        res.redirect('/admin/adminProductsView');
    }).catch(err => console.log(err));
});



router.get('/adminUsersView', ensureAuthenticated, (req, res) => {
    User.findAll({
        where: {
            role: "User"
        },
        
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




router.get('/BuyProduct', (req, res) => {
    Inventory.findAll({
        where: {}
    }).then((inventory) => {
        res.render('./admins/BuyProduct', {
            inventory
        });
    }).catch(err => console.log(err));
});


router.post('/BuyProduct', (req, res) => {
    let {ProductId, ProductName, ProductType, ProductQuantity, productImgURL, ProductCostPrice} = req.body;
    let userId = req.user.id;
    let BuyingDateTime = moment(req.body.BuyingDateTime, 'DD/MM/YYYY HH:mm:ss')

    console.log(productImgURL);

    Inventory.create({
        ProductId,
        ProductName,
        ProductQuantity,
        ProductImage: productImgURL,
        ProductCostPrice,
        ProductType,
        BuyingDateTime,
        userId
    }).then(() => {
        alertMessage(res, 'success', 'Product has been added successfully', 'fa fa-check-circle', true);
        res.redirect('/admin/InventoryProduct');
    }).catch(err => console.log(err));
});



router.get('/InventoryProduct', (req, res) => {
    Inventory.findAll({
        where: {}
    }).then((inventory) => {
        res.render('./admins/InventoryProduct', {
            inventory
        });
    }).catch(err => console.log(err));
});



router.get('/deleteUser/:id', ensureAuthenticated, (req, res) => {
    let id = req.params.id;

    User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        if (user != null) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                alertMessage(res, 'danger', 'User data has been deleted successfully', 'fas fa-trash-alt', true);
                res.redirect('/admin/adminUsersView');
            }).catch(err => console.log(err));
        }
    }).catch(err => console.log(err));
});


router.get('/adminProductsView', (req, res) => {
    Product.findAll({
        where: {}
    }).then((products) => {
        res.render('./admins/adminProductView', {
            products
        });
    }).catch(err => console.log(err));
});


router.post('/upload', ensureAuthenticated, (req, res) => {
    if (!fs.existsSync('./public/adminUploads/' + req.user.id)) {
        fs.mkdirSync('./public/adminUploads/' + req.user.id);
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({
                file: '/images/no-image.jpg',
                err: err
            });
        }

        else {
            if (req.file === undefined) {
                res.json({
                    file: '/images/no-Image.jpg',
                    err: err
                });
            }

            else {
                res.json({
                    file: `/adminUploads/${req.user.id}/${req.file.filename}`
                });
            }
        }
    })
});


router.get('/editUser/:id', (req, res) => {
    let id = req.user.id;

    User.findOne({
        where: {
            id: id
        }
    }).then((user) => {
        res.render('./admins/viewUsers', {
            user
        });
    }).catch(err => console.log(err));
});



// router.get('/viewUser/:id', (req, res) => {
//     User.findOne({
//         where: {
//             id: req.params.id
//         }
//     }).then((user) => {
//         res.render('./admins/viewUser', {
//             user
//         });


//         console.log(user);
//     }).catch(err => console.log(err));
// })


module.exports = router;
