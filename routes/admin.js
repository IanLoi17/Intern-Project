const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const upload = require('../helpers/imageUpload');

router.get('/addProductAdmin', (req, res) => {
    Product.findAll({
        where: {}
    }).then((products) => {
        res.render('./admins/addProductAdmin', {
            products
        });
    }).catch(err => console.log(err));
});

router.get('/adminProductsView', (req, res) => {
    Product.findAll({
        where: {}
    }).then((products) => {
        res.render('./admins/adminProductsView', {
            products
        });
    }).catch(err => console.log(err));
});

router.get('/Product', (req, res) => {
    Product.findAll({
        where: {}
    }).then((products) => {
        res.render('./user/Product', {
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

router.get('/deleteProduct/:id', ensureAuthenticated, (req, res) => {
    let id = req.params.id;

    Product.findOne({
        where: {
            id: id
        }
    }).then((product) => {
        if (product != null) {
            Product.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                alertMessage(res, 'danger', 'User data has been deleted successfully', 'fas fa-trash-alt', true);
                res.redirect('/admin/adminProductsView');
            }).catch(err => console.log(err));
        }
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

router.post('/upload', (req, res) => {
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({
                err: err
            });

            console.log(err);
        }

        else{
            if (req.file === undefined) {
                res.json({
                    err: err
                });

                console.log(err);
            }
            else{
                res.json({
                    file: `/uploads/${req.user.id}/${req.file.filename}`

                });
            }
        }
    });
});

module.exports = router;
