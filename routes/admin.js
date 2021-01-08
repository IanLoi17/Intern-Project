const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/productUpload');

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
    let {ProductName, ProductType, ProductDesc, ProductQuantity, productImgURL, ProductPrice} = req.body;
    let userId = req.user.id;

    console.log(productImgURL);

    Product.create({
        ProductName,
        ProductQuantity,
        ProductImage: productImgURL,
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
})



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
